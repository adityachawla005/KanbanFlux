import { copyList } from "@/actions/copy-list";
import { deleteList } from "@/actions/delete-list";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import React, { ElementRef, useRef } from "react";
import { toast } from "sonner";

interface IListOptionsProps {
  onAddCard: () => void;
  data: List;
}
const ListOptions = ({ onAddCard, data }: IListOptionsProps) => {
  const closePopoverRef = useRef<ElementRef<"button">>(null);
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (list) => {
      toast.success(`List "${list.title}" copied!`);
      closePopoverRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });
  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (list) => {
      toast.success(`List "${list.title}" deleted!`);
      closePopoverRef.current?.click();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onListDeleteFormSubmit = () => {
    const promise = executeDelete({ id: data.id });
    toast.promise(promise, {
      loading: "Delete list loading...",
    });
  };

  const onListCopyFormSubmit = () => {
    executeCopy({ id: data.id });
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-1.5 text-white/40 hover:text-white hover:bg-white/5" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        className="px-0 pt-3 pb-3"
        style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="text-xs font-medium text-center pb-3" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.06em" }}>
          LIST ACTIONS
        </div>
        <PopoverClose asChild>
          <Button
            ref={closePopoverRef}
            className="h-auto w-auto p-2 absolute top-2 right-2 text-white/40 hover:text-white hover:bg-white/5"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-white/70 hover:text-white hover:bg-white/5"
          variant="ghost"
          onClick={onAddCard}
        >
          Add card
        </Button>
        <form action={onListCopyFormSubmit}>
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-white/70 hover:text-white hover:bg-white/5"
          >
            Copy list
          </FormSubmit>
        </form>
        <Separator className="my-1 bg-white/8" />
        <form action={onListDeleteFormSubmit}>
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};

export default ListOptions;
