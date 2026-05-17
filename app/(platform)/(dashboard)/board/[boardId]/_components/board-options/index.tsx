"use client";
import { deleteBoard } from "@/actions/delete-board";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAction } from "@/hooks/use-action";
import { MoreHorizontal, X } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface IBoardOptionsProps {
  id: string;
}
const BoardOptions = ({ id }: IBoardOptionsProps) => {
  const { execute, isLoading } = useAction(deleteBoard, {
    onError: (error) => toast.error(error),
  });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2 text-white/70 hover:text-white hover:bg-white/10" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 pt-3 pb-3"
        side="bottom"
        align="start"
        style={{ background: "#0f1117", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div className="text-[10px] font-medium text-center pb-3 uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "0.12em" }}>
          Board Actions
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-white/40 hover:text-white hover:bg-white/5"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <Button
          variant="ghost"
          onClick={() => {
            const promise = execute({ id });
            toast.promise(promise, { loading: "Deleting board..." });
          }}
          disabled={isLoading}
          className="rounded-none w-full h-auto p-2 px-5 font-normal text-sm justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default BoardOptions;
