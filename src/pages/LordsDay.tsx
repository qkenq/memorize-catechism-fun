
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const LordsDay = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const lordsDay = catechism.find(day => day.id === Number(id));

  useEffect(() => {
    // Get the current user's ID
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
    });
  }, []);

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ['progress', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('lords_day_id', Number(id));
      
      if (error) throw error;
      return data || [];
    }
  });

  if (!lordsDay) {
    return <Navigate to="/lords-days" replace />;
  }

  if (!userId) {
    return <Navigate to="/auth" replace />;
  }

  const currentQuestion = lordsDay.questions[currentQuestionIndex];
  
  const handleNext = async () => {
    // Record progress
    const { error } = await supabase
      .from('progress')
      .upsert({
        lords_day_id: lordsDay.id,
        score: showAnswer ? 100 : 50, // Simple scoring for now
        level: 1,
        user_id: userId
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
      return;
    }

    await refetchProgress();

    // Move to next question or reset
    if (currentQuestionIndex < lordsDay.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      toast({
        title: "Completed!",
        description: `You've completed ${lordsDay.title}!`,
      });
      setCurrentQuestionIndex(0);
      setShowAnswer(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-brand-900 mb-8">
            {lordsDay.title}
          </h1>

          <Card className="p-6 mb-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-brand-800 mb-4">
                  Question {currentQuestionIndex + 1}
                </h2>
                <p className="text-lg text-brand-700">{currentQuestion.question}</p>
              </div>

              {showAnswer ? (
                <div className="space-y-4">
                  <h3 className="font-semibold text-brand-800">Answer:</h3>
                  <p className="text-brand-700">{currentQuestion.answer}</p>
                  <Button onClick={handleNext}>
                    {currentQuestionIndex < lordsDay.questions.length - 1 ? "Next Question" : "Finish"}
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setShowAnswer(true)}>Show Answer</Button>
              )}
            </div>
          </Card>

          <div className="flex justify-between text-sm text-brand-600">
            <span>Question {currentQuestionIndex + 1} of {lordsDay.questions.length}</span>
            {progress && (
              <span>{progress.length} attempts completed</span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default LordsDay;

