
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
          className={`inline-flex items-center whitespace-nowrap border-2 border-sage-200 px-3 py-1.5 ${
            snapshot.isDragging ? 'bg-sage-100 border-sage-300' : 'bg-transparent'
          } rounded-md hover:bg-sage-50 transition-colors cursor-grab active:cursor-grabbing`}
        >
          <span className="text-sage-700">{segment}</span>
        </div>
      )}
    </Draggable>
  );
};
