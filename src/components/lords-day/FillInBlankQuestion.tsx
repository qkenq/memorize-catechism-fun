import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FillInBlankAnswer } from "@/data/catechism/questionTypes";

interface FillInBlankQuestionProps {
  question: string;
  answerData: FillInBlankAnswer;
  onAnswer: (isCorrect: boolean) => void;
}

export const FillInBlankQuestion = ({
  question,
  answerData,
  onAnswer,
}: FillInBlankQuestionProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleSubmit = () => {
    const isCorrect = userAnswer.toLowerCase().trim() === answerData.blank.toLowerCase().trim();
    setHasSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg text-brand-700 leading-relaxed space-y-4">
        <p>{question}</p>
        <div className="p-4 bg-brand-50 rounded-lg">
          <p className="text-brand-600 mb-4">Complete the answer:</p>
          <div className="space-y-2">
            <p>{answerData.beforeBlank}</p>
            <div className="flex items-center gap-2">
              <Input
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="flex-1"
                placeholder="Type the missing part..."
                disabled={hasSubmitted}
              />
            </div>
            {answerData.afterBlank && <p>{answerData.afterBlank}</p>}
          </div>
        </div>
      </div>

      {!hasSubmitted && (
        <Button onClick={handleSubmit} className="w-full">
          Submit Answer
        </Button>
      )}

      {hasSubmitted && (
        <div className="mt-4 p-4 bg-white border rounded-lg">
          <p className="font-medium mb-2">Correct answer:</p>
          <p className={userAnswer.toLowerCase().trim() === answerData.blank.toLowerCase().trim() 
            ? "text-green-600" 
            : "text-red-600"
          }>
            {answerData.blank}
          </p>
        </div>
      )}
    </div>
  );
};