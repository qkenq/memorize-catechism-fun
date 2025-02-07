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
  console.log('Quiz data:', quiz);
  console.log('Visible text:', quiz.visible_text);
  console.log('Gap text:', quiz.gap_text);

  const [segments, setSegments] = useState(quiz.gap_text);
  const [droppedSegments, setDroppedSegments] = useState<(string | null)[]>(
    new Array(quiz.gap_text.length).fill(null)
  );
  const [showFeedback, setShowFeedback] = useState(false);

  // Calculate max width based on longest phrase
  const maxPhraseLength = Math.max(...quiz.gap_text.map(text => text.length));
  // Add some padding for the container
  const gapWidth = Math.max(150, maxPhraseLength * 10 + 32); // 10px per character + 32px padding

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    
    // Get the gap index from the destination
    const gapIndex = parseInt(destination.droppableId.split('-')[1]);
    
    // Don't allow dropping if gap is already filled
    if (droppedSegments[gapIndex] !== null) {
      toast({
        title: "Gap already filled",
        description: "Please drag to an empty gap.",
        variant: "destructive",
      });
      return;
    }

    // Get the dragged segment
    const draggedSegment = segments[source.index];
    
    // Update dropped segments
    const newDroppedSegments = [...droppedSegments];
    newDroppedSegments[gapIndex] = draggedSegment;
    
    // Remove from available segments
    const newSegments = [...segments];
    newSegments.splice(source.index, 1);

    setDroppedSegments(newDroppedSegments);
    setSegments(newSegments);
    setShowFeedback(false);
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
    // Split text into lines first
    const lines = text.split('\n');
    const elements: React.ReactNode[] = [];
    let gapIndex = 0;

    lines.forEach((line, lineIndex) => {
      // Split on _____ pattern
      const parts = line.split('_____');
      
      parts.forEach((part, partIndex) => {
        // Add the text part
        if (part) {
          elements.push(<span key={`text-${lineIndex}-${partIndex}`}>{part}</span>);
        }
        
        // Add gap after each part except the last
        if (partIndex < parts.length - 1) {
          elements.push(
            <GapDropZone
              key={`gap-${gapIndexOffset + gapIndex}`}
              index={gapIndexOffset + gapIndex}
              content={droppedSegments[gapIndexOffset + gapIndex]}
              isCorrect={showFeedback && droppedSegments[gapIndexOffset + gapIndex] === quiz.gap_text[gapIndexOffset + gapIndex]}
              showFeedback={showFeedback}
              width={gapWidth}
            />
          );
          gapIndex++;
        }
      });

      // Add line break after each line except the last
      if (lineIndex < lines.length - 1) {
        elements.push(<br key={`br-${lineIndex}`} />);
      }
    });

    return <>{elements}</>;
  };

  // Update gap count calculation to work with line breaks
  const getGapCount = (text: string) => {
    return (text.match(/\[\[.*?\]\]/g) || []).length;
  };

  return (
    <div className="px-4 md:px-6 animate-fade-in">
      <h2 className="text-xl font-semibold text-brand-800 mb-6">{quiz.title}</h2>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid gap-8">
          {/* Text with inline gaps */}
          <div className="space-y-4 text-lg leading-relaxed">
            {quiz.visible_text.map((part, partIndex) => {
              const gapIndexOffset = partIndex > 0 
                ? quiz.visible_text.slice(0, partIndex).reduce(
                    (acc, text) => acc + getGapCount(text), 
                    0
                  ) 
                : 0;
              
              return (
                <div 
                  key={partIndex}
                  className="p-4 bg-white border border-brand-200 rounded-lg shadow-sm"
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
              <Droppable droppableId="available-segments" direction="horizontal">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-wrap gap-3"
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

      <div className="flex gap-4 mt-8">
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