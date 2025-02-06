import { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { DraggableSegment } from "@/components/lords-day/DraggableSegment";
import { GapDropZone } from "./GapDropZone";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

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
  const [showFeedback, setShowFeedback] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    if (destination.droppableId.startsWith('gap-')) {
      const gapIndex = parseInt(destination.droppableId.split('-')[1]);
      
      if (droppedSegments[gapIndex] !== null) {
        toast({
          title: "Gap already filled",
          description: "Please drag to an empty gap.",
          variant: "destructive",
        });
        return;
      }

      const draggedSegment = segments[source.index];
      const newDroppedSegments = [...droppedSegments];
      newDroppedSegments[gapIndex] = draggedSegment;

      const newSegments = segments.filter((_, index) => index !== source.index);

      setDroppedSegments(newDroppedSegments);
      setSegments(newSegments);
      setShowFeedback(false);
    }
  };

  const handleSubmit = () => {
    if (droppedSegments.includes(null)) {
      toast({
        title: "Incomplete",
        description: "Please fill all gaps before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    setShowFeedback(true);
    const isCorrect = droppedSegments.every((segment, index) => 
      segment === quiz.gap_text[index]
    );

    toast({
      title: isCorrect ? "Correct!" : "Try Again",
      description: isCorrect 
        ? "Great job! You've completed the quiz correctly." 
        : "Some answers are incorrect. Would you like to try again?",
      variant: isCorrect ? "default" : "destructive",
    });
  };

  const handleReset = () => {
    setSegments(quiz.gap_text);
    setDroppedSegments(new Array(quiz.gap_text.length).fill(null));
    setShowFeedback(false);
  };

  const renderTextWithGaps = (text: string, gapIndexOffset: number) => {
    const parts = text.split('_____');
    return parts.map((part, index) => (
      <span key={index}>
        {part}
        {index < parts.length - 1 && (
          <GapDropZone
            index={gapIndexOffset + index}
            content={droppedSegments[gapIndexOffset + index]}
            isCorrect={showFeedback && droppedSegments[gapIndexOffset + index] === quiz.gap_text[gapIndexOffset + index]}
            showFeedback={showFeedback}
          />
        )}
      </span>
    ));
  };

  return (
    <div className="space-y-6 p-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-brand-800">{quiz.title}</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-8">
          {/* Text with inline gaps */}
          <div className="space-y-4 text-lg leading-relaxed">
            {quiz.visible_text.map((part, partIndex) => {
              const gapIndexOffset = partIndex > 0 
                ? quiz.visible_text.slice(0, partIndex).reduce(
                    (acc, text) => acc + (text.match(/_____/g) || []).length, 
                    0
                  ) 
                : 0;
              
              return (
                <div 
                  key={partIndex}
                  className={cn(
                    "p-4 bg-white border border-brand-200 rounded-lg shadow-sm",
                    "transition-all duration-300"
                  )}
                >
                  {renderTextWithGaps(part, gapIndexOffset)}
                </div>
              );
            })}
          </div>

          {/* Available phrases */}
          {segments.length > 0 && (
            <div className="animate-fade-in">
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

      <div className="flex gap-4">
        <Button 
          onClick={handleSubmit}
          className="flex-1"
          disabled={droppedSegments.includes(null)}
        >
          Check Answers
        </Button>
        <Button 
          onClick={handleReset}
          variant="outline"
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </div>
  );
};