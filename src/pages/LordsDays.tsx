import { useEffect, useState } from "react";
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { ChevronRight } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LordsDays = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: progress, refetch } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId);
      
      if (error) {
        console.error("Error fetching progress:", error);
        return [];
      }
      return data || [];
    },
    enabled: !!userId,
    staleTime: 0, // This ensures we always get fresh data
    gcTime: 0  // This ensures the garbage collection happens immediately (formerly cacheTime)
  });

  // Force refetch when component mounts
  useEffect(() => {
    refetch();
  }, [refetch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userId) {
    return <Navigate to="/auth" state={{ from: "/lords-days" }} replace />;
  }

  const getProgressForLordsDay = (lordsDayId: number) => {
    if (!progress) return null;
    return progress.find(p => p.lords_day_id === lordsDayId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-brand-900 mb-8 text-center">
            Lord's Days
          </h1>

          <div className="grid gap-4">
            {catechism.map((lordsDay) => {
              const lordsDayProgress = getProgressForLordsDay(lordsDay.id);
              const totalQuestions = lordsDay.questions.length;
              const progressPercentage = lordsDayProgress ? (lordsDayProgress.score || 0) : 0;

              return (
                <Card 
                  key={lordsDay.id}
                  className="p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <h2 className="text-xl font-semibold text-brand-800">
                        {lordsDay.title}
                      </h2>
                      <p className="text-brand-600">
                        {lordsDay.questions.length} Questions
                      </p>
                      {lordsDayProgress && (
                        <div className="flex items-center gap-2">
                          <div className="w-48 h-2 bg-brand-100 rounded-full">
                            <div 
                              className="h-full bg-sage-600 rounded-full"
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-brand-600">
                            {Math.round(progressPercentage)}%
                          </span>
                        </div>
                      )}
                    </div>
                    <Button asChild>
                      <Link to={`/lords-days/${lordsDay.id}`}>
                        Start Learning
                        <ChevronRight className="ml-2" size={16} />
                      </Link>
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LordsDays;