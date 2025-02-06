import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface LordsDayProgressProps {
  lordsDayId: number;
  userId: string;
}

export const LordsDayProgress = ({ lordsDayId, userId }: LordsDayProgressProps) => {
  const { data: progress } = useQuery({
    queryKey: ['progress', lordsDayId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('lords_day_id', lordsDayId)
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId && !!lordsDayId,
  });

  if (!progress) return null;

  return (
    <div className="mt-6 p-4 bg-white rounded-lg shadow-sm border border-brand-100">
      <div className="text-sm text-brand-600 flex justify-between items-center">
        <span>Best Score: {progress.score}%</span>
        <span>Last studied: {new Date(progress.last_attempt_date).toLocaleDateString()}</span>
      </div>
    </div>
  );
};