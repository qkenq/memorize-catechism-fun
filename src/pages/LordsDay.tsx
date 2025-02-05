import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { catechism } from "@/data/catechism";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Timer, Award, BookOpen } from "lucide-react";

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

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const progressPercentage = ((currentQuestionIndex + 1) / lordsDay.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-white">
      <Navigation />
      
      <main className="pt-24 px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-brand-900">
              {lordsDay.title}
            </h1>
            <div className="flex items-center gap-4 text-brand-600">
              <Timer className="w-5 h-5" />
              <span>{formatTime(progress?.total_time_spent || 0)}</span>
            </div>
          </div>

          <div className="mb-6">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-brand-600 mt-2">
              Question {currentQuestionIndex + 1} of {lordsDay.questions.length}
            </p>
          </div>

          {!isCompleted ? (
            <Card className="p-6 mb-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-brand-800 mb-4">
                    <BookOpen className="inline-block mr-2 w-6 h-6" />
                    Question {currentQuestion.id}
                  </h2>
                  <p className="text-lg text-brand-700">{currentQuestion.question}</p>
                </div>

                {showAnswer ? (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-brand-800">Answer:</h3>
                    <p className="text-brand-700 whitespace-pre-line">{currentQuestion.answer}</p>
                    
                    <div className="pt-4 border-t">
                      <p className="text-brand-800 font-medium mb-4">How well did you know this answer?</p>
                      <div className="flex gap-4">
                        <Button 
                          variant="outline"
                          onClick={() => handleSelfScore(false)}
                          className="flex-1"
                        >
                          Needed Help
                        </Button>
                        <Button 
                          onClick={() => handleSelfScore(true)}
                          className="flex-1"
                        >
                          Knew It Well
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Button 
                    onClick={() => setShowAnswer(true)}
                    className="w-full"
                  >
                    Show Answer
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <Award className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-brand-800 mb-2">
                Lord's Day Complete!
              </h2>
              <p className="text-brand-600 mb-6">
                Great job completing this section. Keep studying to maintain your streak!
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => {
                  setCurrentQuestionIndex(0);
                  setShowAnswer(false);
                  setIsCompleted(false);
                  setSelfScore(0);
                }}>
                  Study Again
                </Button>
                <Button asChild>
                  <a href="/lords-days">Next Lord's Day</a>
                </Button>
              </div>
            </Card>
          )}

          {progress && (
            <div className="text-sm text-brand-600 flex justify-between items-center">
              <span>Best Score: {progress.score}%</span>
              <span>Last studied: {new Date(progress.last_attempt_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LordsDay;