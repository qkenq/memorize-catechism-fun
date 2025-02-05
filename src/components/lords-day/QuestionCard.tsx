
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Question } from "@/data/catechism/types";
import { QuestionSection } from "./QuestionSection";
import { AnswerSection } from "./AnswerSection";

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
    <Card className="p-6 mb-8 animate-fade-in">
      <div className="space-y-6">
        <QuestionSection question={question} />

        {showAnswer ? (
          <AnswerSection 
            answer={question.answer}
            onSelfScore={onSelfScore}
          />
        ) : (
          <div className="space-y-4">
            <p className="text-brand-600 italic">
              Take a moment to think about or write down your answer before revealing the correct one.
            </p>
            <Button 
              onClick={onShowAnswer}
              className="w-full hover:scale-105 transition-transform"
            >
              Show Answer
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};
