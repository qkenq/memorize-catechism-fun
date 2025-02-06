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
            "inline-flex items-center min-w-[3ch] h-[1.5em] mx-1 relative",
            "before:content-[''] before:absolute before:inset-x-0 before:bottom-0 before:h-[2px]",
            content ? "before:bg-transparent" : "before:bg-brand-300",
            snapshot.isDraggingOver && "before:bg-brand-500",
            isHovered && !content && "before:bg-brand-400",
            showFeedback && content && (
              isCorrect 
                ? "text-green-600" 
                : "text-red-600 animate-shake"
            )
          )}
        >
          {content ? (
            <span className="text-inherit">{content}</span>
          ) : (
            <span className="text-brand-300 text-sm invisible">gap</span>
          )}
          {provided.placeholder}
        </span>
      )}
    </Droppable>
  );
};