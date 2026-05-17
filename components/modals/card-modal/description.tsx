import { updateCard } from "@/actions/update-card";
import FormSubmit from "@/components/form/form-submit";
import FormTextarea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/use-action";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { AlignLeft } from "lucide-react";
import { useParams } from "next/navigation";
import React, { ElementRef, KeyboardEventHandler, useRef, useState } from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface ICardModalDescriptionProps {
  data: CardWithList;
}
const CardModalDescription = ({ data }: ICardModalDescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(data.description ?? "");

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => textareaRef.current?.focus());
  };
  const disableEditing = () => setIsEditing(false);

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", data.id] });
      queryClient.invalidateQueries({ queryKey: ["card-logs", data.id] });
      toast.success(`Card "${data.title}" updated.`);
      disableEditing();
    },
    onError: (error) => toast.error(error),
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") disableEditing();
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) formRef.current?.requestSubmit();
  };

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    execute({ id: data.id, description });
  };

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5" style={{ color: "rgba(0,229,153,0.6)" }} />
      <div className="w-full">
        <p className="font-medium text-sm text-white/70 mb-2">Description</p>
        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              name="description"
              ref={textareaRef}
              className="w-full mt-2 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-white/25"
              defaultValue={description}
              onKeyDown={onTextAreaKeyDown}
              placeholder="Add a more detailed description"
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                onClick={disableEditing}
                size="sm"
                variant="ghost"
                className="text-white/50 hover:text-white hover:bg-white/5"
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] text-sm py-3 px-3.5 rounded-md transition-colors"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: data.description ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)",
            }}
          >
            {data.description || "Add a more detailed description..."}
          </div>
        )}
      </div>
    </div>
  );
};

CardModalDescription.Skeleton = function CardModalDescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-white/10" />
      <div className="w-full">
        <Skeleton className="w-24 h-5 mb-2 bg-white/10" />
        <Skeleton className="w-full h-[78px] bg-white/10" />
      </div>
    </div>
  );
};

export default CardModalDescription;
