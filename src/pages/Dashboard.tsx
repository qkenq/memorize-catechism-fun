
import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Session } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Flame, Calendar, BookOpen, ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { catechism } from "@/data/catechism";

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
        .eq('user_id', session?.user?.id);
      
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

  const calculateOverallProgress = () => {
    if (!progressData) return 0;
    const totalQuestions = catechism.reduce((acc, day) => acc + day.questions.length, 0);
    const completedQuestions = progressData.length;
    return Math.round((completedQuestions / totalQuestions) * 100);
  };

  const progressPercentage = calculateOverallProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4">
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
                  <p className="text-2xl font-bold text-brand-900">{profile?.streak_days || 0} days</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-brand-100 rounded-full">
                  <Calendar className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <p className="text-sm text-brand-600">Last Activity</p>
                  <p className="text-2xl font-bold text-brand-900">
                    {formatDate(profile?.last_activity_date)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6 mb-8" asChild>
            <Link to="/lords-days" className="block hover:shadow-md transition-shadow">
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
            </Link>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold text-brand-800 mb-4">Recent Activity</h2>
            <p className="text-brand-600">
              Keep learning to improve your stats! Study the catechism daily to maintain your streak.
            </p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
