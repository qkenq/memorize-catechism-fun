import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DragAndDropAnswer } from "@/data/catechism/questionTypes";
import { DragHandleDots2Icon } from "@radix-ui/react-icons";

interface DragAndDropQuestionProps {
  question: string;
  answerData: DragAndDropAnswer;
  onAnswer: (isCorrect: boolean) => void;
}

export const DragAndDropQuestion = ({
  question,
  answerData,
  onAnswer,
}: DragAndDropQuestionProps) => {
  const [segments, setSegments] = useState([...answerData.segments]);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const moveSegment = (from: number, to: number) => {
    const newSegments = [...segments];
    const [removed] = newSegments.splice(from, 1);
    newSegments.splice(to, 0, removed);
    setSegments(newSegments);
  };

  const handleSubmit = () => {
    const currentOrder = segments.map(segment => 
      answerData.segments.indexOf(segment)
    );
    const isCorrect = currentOrder.every(
      (order, index) => order === answerData.correctOrder[index]
    );
    setHasSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <p className="text-lg text-brand-700 leading-relaxed">{question}</p>
      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div
            key={segment}
            className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm"
          >
            <DragHandleDots2Icon className="h-5 w-5 text-gray-400" />
            <span>{segment}</span>
            <div className="flex gap-2 ml-auto">
              {index > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveSegment(index, index - 1)}
                  disabled={hasSubmitted}
                >
                  ↑
                </Button>
              )}
              {index < segments.length - 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => moveSegment(index, index + 1)}
                  disabled={hasSubmitted}
                >
                  ↓
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      {!hasSubmitted && (
        <Button onClick={handleSubmit} className="mt-4">
          Submit Answer
        </Button>
      )}
      {hasSubmitted && (
        <div className="mt-4">
          <p className="font-medium mb-2">Correct order:</p>
          {answerData.correctOrder.map((index) => (
            <p key={index} className="text-green-600">
              {answerData.segments[index]}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};