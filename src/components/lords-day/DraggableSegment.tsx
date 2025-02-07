import { GripVertical } from "lucide-react";
import { Draggable } from "@hello-pangea/dnd";

interface DraggableSegmentProps {
  segment: string;
  index: number;
}

export const DraggableSegment = ({ segment, index }: DraggableSegmentProps) => {
  return (
    <Draggable key={segment} draggableId={segment} index={index}>
      {(provided, snapshot) => {
        // Remove any transform when not dragging to keep text in place
        const style = {
          ...provided.draggableProps.style,
          transform: snapshot.isDragging ? provided.draggableProps.style?.transform : 'none',
          // Center the drag cursor on the text
          transformOrigin: 'center',
        };

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`inline-flex items-center whitespace-nowrap ${
              snapshot.isDragging ? 'bg-sage-100' : 'bg-transparent'
            } rounded cursor-move hover:bg-sage-50 transition-colors`}
            style={style}
          >
            <GripVertical className="h-4 w-4 text-sage-400 hover:text-sage-600 mr-1" />
            <span className="text-sage-700">{segment}</span>
          </div>
        );
      }}
    </Draggable>
  );
};
