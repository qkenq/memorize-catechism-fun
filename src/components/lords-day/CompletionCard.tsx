
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Award } from "lucide-react";

interface CompletionCardProps {
  onStudyAgain: () => void;
}

export const CompletionCard = ({ onStudyAgain }: CompletionCardProps) => {
  return (
    <Card className="p-6 text-center">
      <Award className="w-12 h-12 text-brand-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-brand-800 mb-2">
        Lord's Day Complete!
      </h2>
      <p className="text-brand-600 mb-6">
        Great job completing this section. Keep studying to maintain your streak!
      </p>
      <div className="flex gap-4 justify-center">
        <Button variant="outline" onClick={onStudyAgain}>
          Study Again
        </Button>
        <Button asChild>
          <a href="/lords-days">Next Lord's Day</a>
        </Button>
      </div>
    </Card>
  );
};
