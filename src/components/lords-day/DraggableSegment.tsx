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
          className={`flex items-center gap-2 p-4 ${
            snapshot.isDragging ? 'bg-sage-200' : 'bg-sage-100'
          } border border-sage-200 rounded-lg shadow-sm cursor-move hover:bg-sage-200 transition-colors group`}
        >
          <GripVertical className="h-5 w-5 text-sage-500 group-hover:text-sage-600" />
          <span className="text-sage-800">{segment}</span>
        </div>
      )}
    </Draggable>
  );
};