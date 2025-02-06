import { useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import { DroppableGap } from "@/components/lords-day/DroppableGap";
import { DraggableSegment } from "@/components/lords-day/DraggableSegment";
import { Button } from "@/components/ui/button";

interface QuizPreviewProps {
  quiz: {
    title: string;
    visible_text: string[];
    gap_text: string[];
    type: 'drag_and_drop' | 'fill_in_blank';
  };
}

export const QuizPreview = ({ quiz }: QuizPreviewProps) => {
  const [segments, setSegments] = useState(quiz.gap_text);
  const [droppedSegments, setDroppedSegments] = useState<(string | null)[]>(
    new Array(quiz.gap_text.length).fill(null)
  );
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (destination.droppableId.startsWith('gap-')) {
      const gapIndex = parseInt(destination.droppableId.split('-')[1]);
      
      if (droppedSegments[gapIndex] !== null) {
        return;
      }

      const draggedSegment = segments[source.index];
      const newDroppedSegments = [...droppedSegments];
      newDroppedSegments[gapIndex] = draggedSegment;

      const newSegments = segments.filter((_, index) => index !== source.index);

      setDroppedSegments(newDroppedSegments);
      setSegments(newSegments);
    }
  };

  const handleSubmit = () => {
    if (droppedSegments.includes(null)) return;
    setHasSubmitted(true);
  };

  const handleReset = () => {
    setSegments(quiz.gap_text);
    setDroppedSegments(new Array(quiz.gap_text.length).fill(null));
    setHasSubmitted(false);
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-xl font-semibold text-brand-800">{quiz.title}</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left column: Text with gaps */}
          <div className="space-y-4">
            <div className="space-y-3">
              {quiz.visible_text.map((part, index) => (
                <div key={`answer-section-${index}`} className="space-y-3">
                  <div className="p-4 bg-white border border-brand-200 rounded-lg shadow-sm">
                    <p className="text-brand-700">{part}</p>
                  </div>
                  <DroppableGap 
                    index={index}
                    content={droppedSegments[index]}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right column: Draggable segments */}
          {!hasSubmitted && segments.length > 0 && (
            <div>
              <h3 className="font-medium text-brand-800 mb-4">Available phrases:</h3>
              <div className="space-y-3">
                {segments.map((segment, index) => (
                  <DraggableSegment 
                    key={segment}
                    segment={segment}
                    index={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DragDropContext>

      <div className="flex gap-4">
        {!hasSubmitted ? (
          <Button 
            onClick={handleSubmit}
            className="w-full"
            disabled={droppedSegments.includes(null)}
          >
            Submit Answer
          </Button>
        ) : (
          <Button 
            onClick={handleReset}
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  );
};