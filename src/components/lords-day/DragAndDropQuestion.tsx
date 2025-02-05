import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DragAndDropAnswer } from "@/data/catechism/questionTypes";
import { GripVertical } from "lucide-react";

interface DragAndDropQuestionProps {
  question: string;
  answerData: DragAndDropAnswer;
  onAnswer: (isCorrect: boolean) => void;
}

const splitIntoThirds = (text: string): [string, string] => {
  const words = text.split(' ');
  const twoThirdsIndex = Math.floor(words.length * (2/3));
  return [
    words.slice(0, twoThirdsIndex).join(' '),
    words.slice(twoThirdsIndex).join(' ')
  ];
};

const splitAnswerIntoSegments = (answer: string): string[] => {
  // Split answer into sentences or clauses (using periods, semicolons, or other major punctuation)
  const clauses = answer.split(/(?<=[.;])\s+/);
  
  let segments: string[] = [];
  let visibleParts: string[] = [];
  
  clauses.forEach(clause => {
    const [visible, gap] = splitIntoThirds(clause.trim());
    visibleParts.push(visible);
    if (gap) segments.push(gap);
  });
  
  return [visibleParts.join(' '), ...segments];
};

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
      <div className="text-lg text-brand-700 leading-relaxed space-y-4">
        <p>{question}</p>
        <div className="p-4 bg-brand-50 rounded-lg">
          <p className="text-brand-600 mb-4">Drag the blocks below to complete each gap:</p>
          <div className="space-y-2">
            {/* Fixed first part */}
            <div className="p-3 bg-white border rounded-lg">
              <p>{segments[0]}</p>
            </div>
            {/* Draggable segments */}
            <div className="mt-4 space-y-2">
              <p className="text-brand-600 font-medium">Available blocks:</p>
              {segments.slice(1).map((segment, index) => (
                <div
                  key={segment}
                  className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm cursor-move"
                >
                  <GripVertical className="h-5 w-5 text-gray-400" />
                  <span>{segment}</span>
                  <div className="flex gap-2 ml-auto">
                    {index > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSegment(index + 1, index)}
                        disabled={hasSubmitted}
                      >
                        ↑
                      </Button>
                    )}
                    {index < segments.length - 2 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveSegment(index + 1, index + 2)}
                        disabled={hasSubmitted}
                      >
                        ↓
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
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
          <p className="font-medium mb-2">Correct order:</p>
          {answerData.segments.map((segment, index) => (
            <p key={index} className="text-green-600 mb-2">
              {segment}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};