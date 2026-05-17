import { copyCard } from "@/actions/copy-card";
import { deleteCard } from "@/actions/delete-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import useCardModal from "@/hooks/use-card-modal";
import { CardWithList } from "@/types";
import { Copy, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface ICardModalActionsProps {
  data: CardWithList;
}

const CardModalActions = ({ data }: ICardModalActionsProps) => {
  const { onClose } = useCardModal();
  const { execute: executeCardCopy, isLoading: isCardCopyLoading } = useAction(copyCard, {
    onSuccess: () => { toast.success(`Card "${data.title}" copied.`); onClose(); },
    onError: (error) => toast.error(error),
  });
  const { execute: executeCardDelete, isLoading: isCardDeleteLoading } = useAction(deleteCard, {
    onSuccess: () => { toast.success(`Card "${data.title}" deleted.`); onClose(); },
    onError: (error) => toast.error(error),
  });

  return (
    <div className="space-y-2 mt-2">
      <p className="text-[10px] font-medium uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.12em" }}>
        Actions
      </p>
      <button
        onClick={() => executeCardCopy({ id: data.id })}
        disabled={isCardCopyLoading || isCardDeleteLoading}
        className="w-full flex items-center gap-x-2 px-3 py-2 rounded-md text-sm text-white/60 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-40"
      >
        <Copy className="h-4 w-4" />
        Copy
      </button>
      <button
        onClick={() => executeCardDelete({ id: data.id })}
        disabled={isCardDeleteLoading || isCardCopyLoading}
        className="w-full flex items-center gap-x-2 px-3 py-2 rounded-md text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-40"
      >
        <Trash className="h-4 w-4" />
        Delete
      </button>
    </div>
  );
};

CardModalActions.Skeleton = function CardModalActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-white/10" />
      <Skeleton className="w-full h-8 bg-white/10" />
      <Skeleton className="w-full h-8 bg-white/10" />
    </div>
  );
};
export default CardModalActions;
