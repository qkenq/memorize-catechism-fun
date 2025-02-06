import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface GapDropZoneProps {
  index: number;
  content: string | null;
  isCorrect?: boolean;
  showFeedback?: boolean;
}

export const GapDropZone = ({ 
  index, 
  content, 
  isCorrect = false,
  showFeedback = false 
}: GapDropZoneProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Droppable droppableId={`gap-${index}`}>
      {(provided, snapshot) => (
        <span
          ref={provided.innerRef}
          {...provided.droppableProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={cn(
            "inline-flex items-center mx-1",
            "border-b-2 border-dotted",
            content ? "border-transparent" : "border-brand-300",
            snapshot.isDraggingOver && "border-brand-500",
            isHovered && !content && "border-brand-400",
            showFeedback && content && (
              isCorrect 
                ? "text-green-600" 
                : "text-red-600 animate-shake"
            )
          )}
        >
          {content ? (
            <span className="text-inherit whitespace-nowrap">{content}</span>
          ) : (
            <span className="w-8 inline-block">&nbsp;</span>
          )}
          {provided.placeholder}
        </span>
      )}
    </Droppable>
  );
};