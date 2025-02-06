import { Droppable } from "@hello-pangea/dnd";

interface DroppableGapProps {
  index: number;
  content: string | null;
}

export const DroppableGap = ({ index, content }: DroppableGapProps) => {
  return (
    <Droppable droppableId={`gap-${index}`}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={`p-4 border-2 border-dashed ${
            snapshot.isDraggingOver ? 'border-brand-500 bg-brand-100' : 'border-brand-300 bg-brand-50/50'
          } rounded-lg min-h-[60px] transition-colors`}
        >
          {content ? (
            <p className="text-brand-700">{content}</p>
          ) : (
            <p className="text-brand-400 text-center">Drag a phrase here</p>
          )}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};