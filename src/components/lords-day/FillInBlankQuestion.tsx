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
      <p className="text-lg text-brand-700 leading-relaxed">{question}</p>
      <div className="flex items-center gap-2">
        <span>{answerData.beforeBlank}</span>
        <Input
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="w-48"
          disabled={hasSubmitted}
        />
        <span>{answerData.afterBlank}</span>
      </div>
      {!hasSubmitted && (
        <Button onClick={handleSubmit} className="mt-4">
          Submit Answer
        </Button>
      )}
      {hasSubmitted && (
        <div className="mt-4">
          <p className={userAnswer.toLowerCase().trim() === answerData.blank.toLowerCase().trim() 
            ? "text-green-600" 
            : "text-red-600"
          }>
            Correct answer: {answerData.blank}
          </p>
        </div>
      )}
    </div>
  );
};