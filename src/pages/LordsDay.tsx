
import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { QuestionCard } from "@/components/lords-day/QuestionCard";
import { CompletionCard } from "@/components/lords-day/CompletionCard";
import { ProgressHeader } from "@/components/lords-day/ProgressHeader";

const LordsDay = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selfScore, setSelfScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const lordsDay = catechism.find(day => day.id === Number(id));
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUserId(session.user.id);
      }
    });
    setStartTime(Date.now());
  }, []);

  const { data: progress, refetch: refetchProgress } = useQuery({
    queryKey: ['progress', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('lords_day_id', Number(id))
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!id,
  });

  if (!lordsDay) {
    return <Navigate to="/lords-days" replace />;
  }

  if (!userId) {
    return <Navigate to="/auth" replace />;
  }

  const currentQuestion = lordsDay.questions[currentQuestionIndex];
  
  const handleSelfScore = async (understood: boolean) => {
    const score = understood ? 100 : 50;
    setSelfScore(prev => prev + score);
    await handleNext(score);
  };

  const handleNext = async (questionScore: number) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const averageScore = Math.floor((selfScore + questionScore) / (currentQuestionIndex + 1));
    
    const { error } = await supabase
      .from('progress')
      .upsert({
        lords_day_id: lordsDay.id,
        score: averageScore,
        level: 1,
        user_id: userId,
        total_time_spent: (progress?.total_time_spent || 0) + timeSpent,
        last_attempt_date: new Date().toISOString()
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
    setStartTime(Date.now());

    if (currentQuestionIndex < lordsDay.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
      toast({
        title: "Congratulations! 🎉",
        description: `You've completed ${lordsDay.title} with an average score of ${averageScore}%!`,
      });
    }
  };

  const handleStudyAgain = () => {
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsCompleted(false);
    setSelfScore(0);
    setStartTime(Date.now());
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <ProgressHeader
            title={lordsDay.title}
            totalTimeSpent={progress?.total_time_spent || 0}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={lordsDay.questions.length}
          />

          {!isCompleted ? (
            <QuestionCard
              question={currentQuestion}
              showAnswer={showAnswer}
              onShowAnswer={() => setShowAnswer(true)}
              onSelfScore={handleSelfScore}
            />
          ) : (
            <CompletionCard onStudyAgain={handleStudyAgain} />
          )}

          {progress && (
            <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-brand-100">
              <div className="text-sm text-brand-600 flex justify-between items-center">
                <span>Best Score: {progress.score}%</span>
                <span>Last studied: {new Date(progress.last_attempt_date).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LordsDay;
