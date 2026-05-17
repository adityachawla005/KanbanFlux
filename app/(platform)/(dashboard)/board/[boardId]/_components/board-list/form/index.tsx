"use client";

import React, { ElementRef, useRef, useState } from "react";
import ListWrapper from "../wrapper";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import FormInput from "@/components/form/form-input";
import { useParams, useRouter } from "next/navigation";
import FormSubmit from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/create-list";
import { toast } from "sonner";

const ListForm = () => {
  const params = useParams();
  const router = useRouter();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };
  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      disableEditing();
      router.refresh();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    const promise = execute({ title, boardId });
    toast.promise(promise, {
      loading: "Create list loading...",
    });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  if (isEditing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          action={onSubmit}
          className="w-full p-3 rounded-lg space-y-3 shadow-xl"
          style={{ background: "rgba(15,17,21,0.96)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <FormInput
            id="title"
            ref={inputRef}
            errors={fieldErrors}
            className="text-sm px-2 py-1 h-7 border-transparent font-medium hover:border-input focus-within:border-input transition"
            placeholder="Enter list title..."
          />
          <input
            name="boardId"
            className="hidden"
            onChange={() => 0}
            value={params.boardId}
          />
          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-lg p-3 flex items-center font-medium text-sm text-white/60 hover:text-white transition-colors duration-150"
        style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.06)" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
        onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.06)")}
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a list
      </button>
    </ListWrapper>
  );
};

export default ListForm;
