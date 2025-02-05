
import { BookOpen, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ActivityItem {
  id: string;  // Changed from number to string to match Supabase's UUID type
  lordsDayTitle: string;
  score: number;
  total_time_spent: number | null;
  last_attempt_date: string | null;
}

interface RecentActivityProps {
  activities: ActivityItem[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const formatDate = (date: string | null) => {
    if (!date) return 'No activity yet';
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (seconds: number | null) => {
    if (!seconds) return '0m';
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m`;
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold text-brand-800 mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <div 
              key={activity.id}
              className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-brand-50 rounded-full">
                  <BookOpen className="w-4 h-4 text-brand-600" />
                </div>
                <div>
                  <p className="font-medium text-brand-800">{activity.lordsDayTitle}</p>
                  <p className="text-sm text-brand-600">Score: {activity.score}%</p>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm text-brand-600">
                  <Clock className="w-4 h-4" />
                  {formatTime(activity.total_time_spent)}
                </div>
                <p className="text-xs text-brand-500">
                  {formatDate(activity.last_attempt_date)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-brand-600">
            Keep learning to improve your stats! Study the catechism daily to maintain your streak.
          </p>
        )}
      </div>
    </Card>
  );
};
