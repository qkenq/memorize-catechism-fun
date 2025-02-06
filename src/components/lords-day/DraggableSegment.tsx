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
          className={`inline-flex items-center gap-2 px-3 py-1.5 ${
            snapshot.isDragging ? 'bg-sage-100 shadow-lg' : 'bg-transparent'
          } rounded-md cursor-move hover:bg-sage-50 transition-all group border border-transparent hover:border-sage-200`}
        >
          <GripVertical className="h-4 w-4 text-sage-400 group-hover:text-sage-500" />
          <span className="text-sage-700">{segment}</span>
        </div>
      )}
    </Draggable>
  );
};