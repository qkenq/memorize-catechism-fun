
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const LordsDays = () => {
  const { data: progress } = useQuery({
    queryKey: ['progress'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*');
      
      if (error) throw error;
      return data || [];
    }
  });

  const getProgressForLordsDay = (lordsDayId: number) => {
    if (!progress) return null;
    return progress.filter(p => p.lords_day_id === lordsDayId);
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
              const completedQuestions = lordsDayProgress?.length || 0;
              const progressPercentage = (completedQuestions / totalQuestions) * 100;

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
