
import { Button } from "@/components/ui/button";

interface AnswerSectionProps {
  answer: string;
  onSelfScore: (understood: boolean) => void;
}

export const AnswerSection = ({ answer, onSelfScore }: AnswerSectionProps) => {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-brand-800">Answer:</h3>
      <p className="text-brand-700 whitespace-pre-line">{answer}</p>
      
      <div className="pt-4 border-t">
        <p className="text-brand-800 font-medium mb-4">How well did you know this answer?</p>
        <div className="flex gap-4">
          <Button 
            variant="outline"
            onClick={() => onSelfScore(false)}
            className="flex-1"
          >
            Needed Help
          </Button>
          <Button 
            onClick={() => onSelfScore(true)}
            className="flex-1"
          >
            Knew It Well
          </Button>
        </div>
      </div>
    </div>
  );
};
