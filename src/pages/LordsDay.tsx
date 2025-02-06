import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { QuestionCard } from "@/components/lords-day/QuestionCard";
import { CompletionCard } from "@/components/lords-day/CompletionCard";
import { LordsDayHeader } from "@/components/lords-day/LordsDayHeader";
import { LordsDayProgress } from "@/components/lords-day/LordsDayProgress";

const LordsDay = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [selfScore, setSelfScore] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);

  const lordsDay = catechism.find(day => day.id === Number(id));

  useEffect(() => {
    console.log("LordsDay component mounted, checking auth...");
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Auth session checked:", session?.user?.id || "no session");
      setUserId(session?.user?.id || null);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: userProfile } = useQuery({
    queryKey: ['profile', userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const handleSelfScore = async (understood: boolean) => {
    const score = understood ? 100 : 50;
    setSelfScore(prev => prev + score);
    await handleNext(score);
  };

  const handleNext = async (questionScore: number) => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const averageScore = Math.floor((selfScore + questionScore) / (currentQuestionIndex + 1));
    
    const userLevel = userProfile?.level || 1;
    const isLevel1 = userLevel === 1;
    
    // For level 1, we stay on Q&A 1 and just increment rounds
    if (isLevel1) {
      if (currentRound < 3) {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setShowAnswer(false);
        setSelfScore(0);
        await updateProgress(averageScore, timeSpent, nextRound);
      } else {
        setIsCompleted(true);
        await updateProgress(averageScore, timeSpent, 3);
        toast({
          title: "Congratulations! 🎉",
          description: `You've completed ${lordsDay!.title} with an average score of ${averageScore}%!`,
        });
      }
    } else {
      // Normal progression through questions for higher levels
      if (currentQuestionIndex < lordsDay!.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setShowAnswer(false);
      } else if (currentRound < 3) {
        const nextRound = currentRound + 1;
        setCurrentRound(nextRound);
        setCurrentQuestionIndex(0);
        setShowAnswer(false);
        setSelfScore(0);
        await updateProgress(averageScore, timeSpent, nextRound);
      } else {
        setIsCompleted(true);
        await updateProgress(averageScore, timeSpent, 3);
        toast({
          title: "Congratulations! 🎉",
          description: `You've completed ${lordsDay!.title} with an average score of ${averageScore}%!`,
        });
      }
    }
    setStartTime(Date.now());
  };

  const updateProgress = async (score: number, timeSpent: number, round: number) => {
    const { error } = await supabase
      .from('progress')
      .upsert({
        lords_day_id: lordsDay!.id,
        user_id: userId,
        score,
        level: userProfile?.level || 1,
        current_round: round,
        total_time_spent: timeSpent,
        last_attempt_date: new Date().toISOString()
      }, {
        onConflict: 'user_id,lords_day_id'
      });

    if (error) {
      console.error("Error updating progress:", error);
      toast({
        title: "Error",
        description: "Failed to save progress",
        variant: "destructive",
      });
    }
  };

  const handleStudyAgain = () => {
    setCurrentQuestionIndex(0);
    setShowAnswer(false);
    setIsCompleted(false);
    setSelfScore(0);
    setCurrentRound(1);
    setStartTime(Date.now());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
        <Navigation />
        <main className="container mx-auto pt-24 px-4">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    );
  }

  if (!lordsDay) {
    console.log("Invalid Lord's Day ID:", id);
    return <Navigate to="/lords-days" replace />;
  }

  if (!userId) {
    console.log("No user ID found, redirecting to auth");
    return <Navigate to="/auth" replace />;
  }

  const questions = userProfile?.level === 1 
    ? [lordsDay.questions[0]] // Only show first question for level 1
    : lordsDay.questions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4 pb-12">
        <div className="container max-w-[1600px] mx-auto">
          <LordsDayHeader
            title={lordsDay.title}
            totalTimeSpent={0}
            currentQuestion={currentQuestionIndex}
            totalQuestions={questions.length}
            currentRound={currentRound}
          />

          {!isCompleted ? (
            <QuestionCard
              question={questions[currentQuestionIndex]}
              showAnswer={showAnswer}
              onShowAnswer={() => setShowAnswer(true)}
              onSelfScore={handleSelfScore}
              userLevel={userProfile?.level || 1}
              currentRound={currentRound}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
            />
          ) : (
            <CompletionCard onStudyAgain={handleStudyAgain} />
          )}

          <LordsDayProgress lordsDayId={lordsDay.id} userId={userId} />
        </div>
      </main>
    </div>
  );
};

export default LordsDay;