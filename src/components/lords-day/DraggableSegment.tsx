import { GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface DraggableSegmentProps {
  segment: string;
  index: number;
}

export const DraggableSegment = ({ segment, index }: DraggableSegmentProps) => {
  return (
    <Draggable key={segment} draggableId={segment} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`inline-flex items-center whitespace-nowrap ${
            snapshot.isDragging ? 'bg-sage-100' : 'bg-transparent'
          } rounded cursor-move hover:bg-sage-50 transition-colors`}
          style={{
            ...provided.draggableProps.style,
            cursor: snapshot.isDragging ? 'grabbing' : 'grab',
            // Remove any transform adjustments to keep element directly under cursor
            pointerEvents: 'auto',
          }}
        >
          <GripVertical className="h-4 w-4 text-sage-400 hover:text-sage-600 mr-1" />
          <span className="text-sage-700">{segment}</span>
        </div>
      )}
    </Draggable>
  );
};
