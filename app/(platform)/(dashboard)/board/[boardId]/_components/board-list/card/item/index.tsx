import useCardModal from "@/hooks/use-card-modal";
import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@prisma/client";
import React from "react";

interface IBoardListCardItemProps {
  index: number;
  data: Card;
}
const BoardListCardItem = ({ data, index }: IBoardListCardItemProps) => {
  const cardModal = useCardModal();
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role={"button"}
          onClick={() => cardModal.onOpen(data.id)}
          className="truncate border border-white/5 hover:border-[#00e599]/30 py-2 px-3 text-white/80 hover:text-white text-sm rounded-md shadow-sm transition-all duration-150"
          style={{ background: "rgba(30,35,42,0.95)" }}
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};

export default BoardListCardItem;
