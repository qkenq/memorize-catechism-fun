
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";
import type { Question } from "@/data/catechism/types";

interface QuestionCardProps {
  question: Question;
  showAnswer: boolean;
  onShowAnswer: () => void;
  onSelfScore: (understood: boolean) => void;
}

export const QuestionCard = ({
  question,
  showAnswer,
  onShowAnswer,
  onSelfScore,
}: QuestionCardProps) => {
  return (
    <Card className="p-6 mb-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-brand-800 mb-4 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Question {question.id}
          </h2>
          <p className="text-lg text-brand-700">{question.question}</p>
        </div>

        {showAnswer ? (
          <div className="space-y-4">
            <h3 className="font-semibold text-brand-800">Answer:</h3>
            <p className="text-brand-700 whitespace-pre-line">{question.answer}</p>
            
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
        ) : (
          <Button 
            onClick={onShowAnswer}
            className="w-full"
          >
            Show Answer
          </Button>
        )}
      </div>
    </Card>
  );
};
