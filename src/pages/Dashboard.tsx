
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Flame, Calendar, BookOpen, ArrowRight, Clock, Star, Target, Brain } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { catechism } from "@/data/catechism";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

const Dashboard = () => {
  const [session, setSession] = useState<Session | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: profile } = useQuery({
    queryKey: ['profile', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session?.user?.id)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress', session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('last_attempt_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!session?.user?.id,
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'No activity yet';
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  const calculateOverallProgress = () => {
    if (!progressData) return 0;
    const totalQuestions = catechism.reduce((acc, day) => acc + day.questions.length, 0);
    const completedQuestions = progressData.length;
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const calculateAverageScore = () => {
    if (!progressData || progressData.length === 0) return 0;
    const totalScore = progressData.reduce((acc, progress) => acc + progress.score, 0);
    return Math.round(totalScore / progressData.length);
  };

  const progressPercentage = calculateOverallProgress();
  const averageScore = calculateAverageScore();

  const getRecentActivity = () => {
    if (!progressData) return [];
    return progressData.slice(0, 5).map(progress => {
      const lordsDay = catechism.find(day => day.id === progress.lords_day_id);
      return {
        ...progress,
        lordsDayTitle: lordsDay ? lordsDay.title : `Lord's Day ${progress.lords_day_id}`,
      };
    });
  };

  const getDailyGoal = () => {
    return profile?.streak_days >= 7 ? 3 : 1;
  };

  const getCompletedToday = () => {
    if (!progressData) return 0;
    const today = new Date().toISOString().split('T')[0];
    return progressData.filter(p => 
      p.last_attempt_date?.split('T')[0] === today
    ).length;
  };

  const dailyGoal = getDailyGoal();
  const completedToday = getCompletedToday();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-brand-900">Dashboard</h1>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-100 rounded-full">
                  <Trophy className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-600">Total XP</p>
                  <p className="text-2xl font-bold text-brand-900">{profile?.xp || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-100 rounded-full">
                  <Flame className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-600">Current Streak</p>
                  <HoverCard>
                    <HoverCardTrigger>
                      <p className="text-2xl font-bold text-brand-900 cursor-help">
                        {profile?.streak_days || 0} days
                      </p>
                    </HoverCardTrigger>
                    <HoverCardContent>
                      <p className="text-sm">
                        Study daily to maintain your streak! After 7 days, your daily goal increases to 3 Lord's Days.
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-100 rounded-full">
                  <Star className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-600">Average Score</p>
                  <p className="text-2xl font-bold text-brand-900">{averageScore}%</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link to="/lords-days">
              <Card className="p-6 hover:shadow-md transition-shadow h-full">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-brand-100 rounded-full">
                        <BookOpen className="w-6 h-6 text-brand-600" />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-brand-800">Overall Progress</h2>
                        <p className="text-sm text-brand-600">
                          {progressPercentage}% Complete
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-brand-600" />
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                </div>
              </Card>
            </Link>

            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-brand-100 rounded-full">
                    <Target className="w-6 h-6 text-brand-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-brand-800">Today's Goal</h2>
                    <p className="text-sm text-brand-600">
                      {completedToday} / {dailyGoal} Lord's Days
                    </p>
                  </div>
                </div>
                <Progress 
                  value={(completedToday / dailyGoal) * 100} 
                  className="h-2"
                />
                <p className="text-sm text-brand-500">
                  {completedToday >= dailyGoal 
                    ? "Daily goal achieved! Keep going for bonus XP!" 
                    : `Complete ${dailyGoal - completedToday} more Lord's ${dailyGoal - completedToday === 1 ? 'Day' : 'Days'} to reach your goal`
                  }
                </p>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-brand-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {getRecentActivity().length > 0 ? (
                getRecentActivity().map((activity) => (
                  <div 
                    key={activity.id}
                    className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-brand-50 rounded-full">
                        <BookOpen className="w-4 h-4 text-brand-600" />
                      </div>
                      <div>
                        <p className="font-medium text-brand-800">{activity.lordsDayTitle}</p>
                        <p className="text-sm text-brand-600">Score: {activity.score}%</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 text-sm text-brand-600">
                        <Clock className="w-4 h-4" />
                        {formatTime(activity.total_time_spent)}
                      </div>
                      <p className="text-xs text-brand-500">
                        {formatDate(activity.last_attempt_date)}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-brand-600">
                  Keep learning to improve your stats! Study the catechism daily to maintain your streak.
                </p>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

