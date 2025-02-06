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

export const DragAndDropQuestion = ({
  question,
  answerData,
  onAnswer,
}: DragAndDropQuestionProps) => {
  const [segments, setSegments] = useState([...answerData.segments]);
  const [droppedSegments, setDroppedSegments] = useState<(string | null)[]>(
    new Array(answerData.segments.length).fill(null)
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = parseInt(result.destination.droppableId.split('-')[1]);

    // Update the dropped segments array
    const newDroppedSegments = [...droppedSegments];
    newDroppedSegments[destinationIndex] = segments[sourceIndex];

    // Remove the segment from the available segments
    const newSegments = segments.filter((_, index) => index !== sourceIndex);

    setDroppedSegments(newDroppedSegments);
    setSegments(newSegments);
  };

  const handleSubmit = () => {
    // Check if all segments have been placed
    if (droppedSegments.includes(null)) {
      return; // Don't submit if not all segments are placed
    }

    const isCorrect = droppedSegments.every(
      (segment, index) => segment === answerData.segments[answerData.correctOrder[index]]
    );
    setHasSubmitted(true);
    onAnswer(isCorrect);
  };

  return (
    <div className="space-y-4">
      <div className="text-lg text-brand-700 leading-relaxed">
        <p className="mb-6">{question}</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column: Text with interspersed gaps */}
          <div className="space-y-4">
            <h3 className="font-medium text-brand-800 mb-4">Complete the answer:</h3>
            <div className="space-y-3">
              {answerData.visibleParts?.map((part, index) => (
                <div key={`answer-section-${index}`} className="space-y-3">
                  <div className="p-4 bg-white border border-brand-200 rounded-lg shadow-sm">
                    <p className="text-brand-700">{part}</p>
                  </div>
                  {index < answerData.segments.length && (
                    <Droppable droppableId={`gap-${index}`}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`p-4 border-2 border-dashed ${
                            snapshot.isDraggingOver ? 'border-brand-500 bg-brand-100' : 'border-brand-300 bg-brand-50/50'
                          } rounded-lg min-h-[60px] transition-colors`}
                        >
                          {droppedSegments[index] ? (
                            <p className="text-brand-700">{droppedSegments[index]}</p>
                          ) : (
                            <p className="text-brand-400 text-center">Drag a phrase here</p>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Draggable segments */}
          <div>
            <h3 className="font-medium text-brand-800 mb-4">Available phrases:</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="available-segments">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-3"
                  >
                    {segments.map((segment, index) => (
                      <Draggable key={segment} draggableId={segment} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`flex items-center gap-2 p-4 ${
                              snapshot.isDragging ? 'bg-sage-200' : 'bg-sage-100'
                            } border border-sage-200 rounded-lg shadow-sm cursor-move hover:bg-sage-200 transition-colors group`}
                          >
                            <GripVertical className="h-5 w-5 text-sage-500 group-hover:text-sage-600" />
                            <span className="text-sage-800">{segment}</span>
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
      </div>

      {!hasSubmitted && (
        <Button 
          onClick={handleSubmit}
          className="w-full mt-8"
          disabled={droppedSegments.includes(null)}
        >
          Submit Answer
        </Button>
      )}

      {hasSubmitted && (
        <div className="mt-8 p-4 bg-white border rounded-lg">
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