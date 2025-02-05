import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DragAndDropAnswer } from "@/data/catechism/questionTypes";
import { GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(segments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSegments(items);
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
          <p className="text-brand-600 mb-4">Arrange the blocks in the correct order:</p>
          
          {/* Fixed first part */}
          <div className="p-3 bg-white border rounded-lg mb-4">
            <p>{segments[0]}</p>
          </div>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2"
                >
                  <p className="text-brand-600 font-medium mb-2">Drag these blocks to complete the answer:</p>
                  {segments.slice(1).map((segment, index) => (
                    <Draggable key={segment} draggableId={segment} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="flex items-center gap-2 p-3 bg-white border rounded-lg shadow-sm cursor-move hover:bg-brand-50 transition-colors"
                        >
                          <GripVertical className="h-5 w-5 text-brand-400" />
                          <span>{segment}</span>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
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