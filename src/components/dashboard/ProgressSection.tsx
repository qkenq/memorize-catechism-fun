
import { BookOpen, ArrowRight, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface ProgressSectionProps {
  progressPercentage: number;
  dailyGoal: number;
  completedToday: number;
}

export const ProgressSection = ({ 
  progressPercentage, 
  dailyGoal, 
  completedToday 
}: ProgressSectionProps) => {
  return (
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
  );
};
