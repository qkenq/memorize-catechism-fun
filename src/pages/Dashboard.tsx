
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { catechism } from "@/data/catechism";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ProgressSection } from "@/components/dashboard/ProgressSection";
import { RecentActivity } from "@/components/dashboard/RecentActivity";

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
  const progressPercentage = calculateOverallProgress();
  const averageScore = calculateAverageScore();

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
          
          <StatsCards 
            xp={profile?.xp || 0}
            streakDays={profile?.streak_days || 0}
            averageScore={averageScore}
          />

          <ProgressSection 
            progressPercentage={progressPercentage}
            dailyGoal={dailyGoal}
            completedToday={completedToday}
          />

          <RecentActivity activities={getRecentActivity()} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
