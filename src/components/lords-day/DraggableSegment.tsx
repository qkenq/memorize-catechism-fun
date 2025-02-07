import { Draggable } from "@hello-pangea/dnd";

interface DraggableSegmentProps {
  segment: string;
  index: number;
}

export const DraggableSegment = ({ segment, index }: DraggableSegmentProps) => {
  return (
    <Draggable draggableId={`draggable-${index}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`p-2 border ${
            snapshot.isDragging ? 'border-brand-400 shadow-md' : 'border-brand-300'
          } rounded cursor-move hover:bg-brand-50 transition-colors bg-white`}
        >
          <span className="text-brand-700">{segment}</span>
        </div>
      )}
    </Draggable>
  );
};