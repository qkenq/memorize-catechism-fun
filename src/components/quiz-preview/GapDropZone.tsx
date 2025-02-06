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
            "inline-block min-w-[100px] px-2 py-1 mx-1 border-b-2 transition-all",
            content ? "border-transparent" : "border-brand-300",
            snapshot.isDraggingOver && "border-brand-500 bg-brand-50",
            isHovered && !content && "border-brand-400",
            showFeedback && content && (
              isCorrect 
                ? "text-green-600 bg-green-50" 
                : "text-red-600 bg-red-50 animate-shake"
            )
          )}
        >
          {content ? (
            <span className="text-brand-700">{content}</span>
          ) : (
            <span className="text-brand-300 text-sm">_____</span>
          )}
          {provided.placeholder}
        </span>
      )}
    </Droppable>
  );
};