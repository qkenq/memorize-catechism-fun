
import { Trophy, Flame, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface StatsCardsProps {
  xp: number;
  streakDays: number;
  averageScore: number;
}

export const StatsCards = ({ xp, streakDays, averageScore }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-100 rounded-full">
            <Trophy className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <p className="text-sm text-brand-600">Total XP</p>
            <p className="text-2xl font-bold text-brand-900">{xp || 0}</p>
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
            <HoverCard>
              <HoverCardTrigger>
                <p className="text-2xl font-bold text-brand-900 cursor-help">
                  {streakDays || 0} days
                </p>
              </HoverCardTrigger>
              <HoverCardContent>
                <p className="text-sm">
                  Study daily to maintain your streak! After 7 days, your daily goal increases to 3 Lord's Days.
                </p>
              </HoverCardContent>
            </HoverCard>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-brand-100 rounded-full">
            <Star className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <p className="text-sm text-brand-600">Average Score</p>
            <p className="text-2xl font-bold text-brand-900">{averageScore}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};
