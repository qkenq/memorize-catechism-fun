import { Timer } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LordsDayHeaderProps {
  title: string;
  totalTimeSpent: number;
  currentQuestion: number;
  totalQuestions: number;
  currentRound: number;
}

export const LordsDayHeader = ({
  title,
  totalTimeSpent,
  currentQuestion,
  totalQuestions,
  currentRound,
}: LordsDayHeaderProps) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const progressPercentage = ((currentQuestion + 1) / totalQuestions) * 100;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-brand-900">
          {`${title} - Round ${currentRound}`}
        </h1>
        <div className="flex items-center gap-4 text-brand-600">
          <Timer className="w-5 h-5" />
          <span>{formatTime(totalTimeSpent)}</span>
        </div>
      </div>

      <div className="mb-6">
        <Progress value={progressPercentage} className="h-2" />
      </div>
    </>
  );
};