import { useState } from "react";
import { Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";

interface GapDropZoneProps {
  index: number;
  content: string | null;
  isCorrect?: boolean;
  showFeedback?: boolean;
  width: number;
}

export const GapDropZone = ({ 
  index, 
  content, 
  isCorrect = false,
  showFeedback = false,
  width
}: GapDropZoneProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Droppable droppableId={`gap-${index}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ 
            width: `${width}px`, 
            display: 'inline-flex',
            verticalAlign: 'middle'
          }}
          className={cn(
            "items-center justify-center h-[40px] mx-2 rounded-md border-2 box-content",
            content ? (
              showFeedback ? (
                isCorrect ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"
              ) : "bg-white border-brand-300"
            ) : (
              snapshot.isDraggingOver 
                ? "bg-green-50 border-green-500" 
                : isHovered 
                  ? "bg-white border-brand-400" 
                  : "bg-white border-brand-300"
            )
          )}
        >
          <div className="flex items-center justify-center h-full w-full">
            {content && (
              <span className="px-2">{content}</span>
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};