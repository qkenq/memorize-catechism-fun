import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import type { DragAndDropAnswer } from "@/data/catechism/questionTypes";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { DraggableSegment } from "./DraggableSegment";
import { DroppableGap } from "./DroppableGap";

interface DragAndDropQuestionProps {
  question: string;
  answerData: DragAndDropAnswer;
  onAnswer: (isCorrect: boolean) => void;
  questionNumber: number;
  totalQuestions: number;
  currentRound: number;
}

export const DragAndDropQuestion = ({
  question,
  answerData,
  onAnswer,
  questionNumber,
  totalQuestions,
  currentRound,
}: DragAndDropQuestionProps) => {
  // Prepare segments based on the round
  const getInitialSegments = () => {
    if (currentRound === 3) {
      // For round 3, everything is draggable
      return [...answerData.visibleParts, ...answerData.segments];
    }
    // For rounds 1 and 2, only the segments are draggable
    return [...answerData.segments];
  };

  const getInitialDroppableLength = () => {
    if (currentRound === 3) {
      // For round 3, everything needs a gap
      return answerData.visibleParts.length + answerData.segments.length;
    }
    // For rounds 1 and 2, only segment spaces need gaps
    return answerData.segments.length;
  };

  const [segments, setSegments] = useState(getInitialSegments());
  const [droppedSegments, setDroppedSegments] = useState<(string | null)[]>(
    new Array(getInitialDroppableLength()).fill(null)
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  // Reset the state when the round changes
  useEffect(() => {
    setSegments(getInitialSegments());
    setDroppedSegments(new Array(getInitialDroppableLength()).fill(null));
    setHasSubmitted(false);
  }, [currentRound, answerData.segments, answerData.visibleParts]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (destination.droppableId.startsWith('gap-')) {
      const gapIndex = parseInt(destination.droppableId.split('-')[1]);
      
      if (droppedSegments[gapIndex] !== null) {
        return;
      }

      const draggedSegment = segments[source.index];
      
      // In round 3, any segment can go in any position
      const isCorrectPosition = currentRound === 3 
        ? true 
        : gapIndex === answerData.correctOrder.findIndex(
            index => answerData.segments[index] === draggedSegment
          );

      if (!isCorrectPosition) {
        return;
      }

      const newDroppedSegments = [...droppedSegments];
      newDroppedSegments[gapIndex] = draggedSegment;

      const newSegments = segments.filter((_, index) => index !== source.index);

      setDroppedSegments(newDroppedSegments);
      setSegments(newSegments);
    }
  };

  const handleSubmit = () => {
    if (droppedSegments.includes(null)) {
      return;
    }

    const isCorrect = currentRound === 3
      ? droppedSegments.join(' ') === answerData.visibleParts.concat(answerData.segments).join(' ')
      : droppedSegments.every(
          (segment, index) => segment === answerData.segments[answerData.correctOrder[index]]
        );

    setHasSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="text-lg text-brand-700 leading-relaxed mb-6">
        Q&A {questionNumber}
      </div>

      <div className="text-lg text-brand-700 leading-relaxed mb-6">
        {question}
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column: Text with gaps */}
          <div className="space-y-4">
            <div className="space-y-3">
              {currentRound === 3 ? (
                // In round 3, everything is a gap
                Array.from({ length: getInitialDroppableLength() }).map((_, index) => (
                  <DroppableGap 
                    key={`gap-${index}`}
                    index={index}
                    content={droppedSegments[index]}
                  />
                ))
              ) : (
                // Rounds 1 and 2: Show visible parts with gaps for segments
                answerData.visibleParts?.map((part, index) => (
                  <div key={`answer-section-${index}`} className="space-y-3">
                    <div className="p-4 bg-white border border-brand-200 rounded-lg shadow-sm">
                      <p className="text-brand-700">{part}</p>
                    </div>
                    {index < answerData.segments.length && (
                      <DroppableGap 
                        index={index}
                        content={droppedSegments[index]}
                      />
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right column: Draggable segments */}
          {!hasSubmitted && segments.length > 0 && (
            <div>
              <h3 className="font-medium text-brand-800 mb-4">Available phrases:</h3>
              <Droppable droppableId="available-segments">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {segments.map((segment, index) => (
                      <DraggableSegment 
                        key={segment}
                        segment={segment}
                        index={index}
                      />
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          )}
        </div>
      </DragDropContext>

      {!hasSubmitted && (
        <Button 
          onClick={handleSubmit}
          className="w-full mt-8"
          disabled={droppedSegments.includes(null)}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
};