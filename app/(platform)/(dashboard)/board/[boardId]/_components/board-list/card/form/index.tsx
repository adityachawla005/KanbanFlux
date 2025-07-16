"use client";

import { createCard } from "@/actions/create-card";
import FormTextarea from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { Plus, X, Paperclip, Mic, Trash } from "lucide-react";
import React, {
  ElementRef,
  KeyboardEventHandler,
  forwardRef,
  useRef,
  useState,
  ChangeEvent,
} from "react";
import { toast } from "sonner";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

interface IBoardListCardFormProps {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  isEditing: boolean;
}

const BoardListCardForm = forwardRef<
  HTMLTextAreaElement,
  IBoardListCardFormProps
>(({ listId, isEditing, disableEditing, enableEditing }, ref) => {
  const formRef = useRef<ElementRef<"form">>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<"audio" | "video" | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);

  const { execute } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" created!`);
      formRef.current?.reset();
      setMediaBlob(null);
      setMediaType(null);
      setLocalError(null);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileType = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("audio")
      ? "audio"
      : null;

    if (!fileType) {
      toast.error("Only audio or video files are allowed.");
      return;
    }

    setMediaBlob(file);
    setMediaType(fileType);
  };

  const uploadMedia = async () => {
    if (!mediaBlob) return { mediaUrl: null, mediaType: null };

    try {
      const fileName =
        mediaBlob instanceof File
          ? mediaBlob.name
          : `upload.${mediaType === "audio" ? "webm" : "mp4"}`;

      const getUrlRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName }),
      });

      if (!getUrlRes.ok) throw new Error("Failed to get SAS upload URL");

      const { uploadUrl, mediaUrl } = await getUrlRes.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "x-ms-blob-type": "BlockBlob",
          "Content-Type": mediaBlob.type,
        },
        body: mediaBlob,
      });

      if (!uploadRes.ok) throw new Error("Upload to Azure failed");

      return { mediaUrl, mediaType };
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload media.");
      return { mediaUrl: null, mediaType: null };
    }
  };

  const onCardCreateSubmit = async (formData: FormData) => {
    const title = (formData.get("title") as string)?.trim();

    if (!title || title.length < 3) {
      setLocalError("Title must be at least 3 characters.");
      return;
    }

    setLocalError(null);

    if (mediaBlob) {
      const { mediaUrl, mediaType: type } = await uploadMedia();

      if (!mediaUrl) {
        toast.error("Media upload failed. Card not created.");
        return;
      }

      execute({ title, listId, mediaUrl, mediaType: type! });
    } else {
      execute({ title, listId });
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      stopRecording();
      setMediaBlob(null);
      setMediaType(null);
      setLocalError(null);
      disableEditing();
    }
  };

  useOnClickOutside(formRef, () => {
    stopRecording();
    setMediaBlob(null);
    setMediaType(null);
    setLocalError(null);
    disableEditing();
  });

  useEventListener("keydown", onKeyDown);

  const onTextAreaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setMediaBlob(blob);
        setMediaType("audio");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (error) {
      toast.error("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    mediaRecorder?.stream.getTracks().forEach((t) => t.stop());
    setMediaRecorder(null);
    setRecording(false);
  };

  if (isEditing) {
    return (
      <form
        ref={formRef}
        action={onCardCreateSubmit}
        className="m-2 p-4 space-y-4 bg-white/80 rounded-xl shadow-lg backdrop-blur-sm"
      >
        <FormTextarea
          id="title"
          name="title"
          ref={ref}
          onKeyDown={onTextAreaKeyDown}
          placeholder="Enter title for this card..."
          errors={localError ? { title: [localError] } : undefined}
          className="min-h-[60px]"
        />

        {mediaBlob && mediaType === "video" && (
          <div className="space-y-2">
            <video
              controls
              src={URL.createObjectURL(mediaBlob)}
              className="w-full rounded-md shadow"
            />
          </div>
        )}

        {mediaBlob && mediaType === "audio" && (
          <div className="space-y-2">
            <audio
              controls
              src={URL.createObjectURL(mediaBlob)}
              className="w-full"
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          <Button type="submit" className="bg-black text-white hover:bg-gray-900" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            className="bg-black text-white hover:bg-gray-900"
            size="icon"
            onClick={() => {
              stopRecording();
              setMediaBlob(null);
              setMediaType(null);
              setLocalError(null);
              disableEditing();
            }}
          >
            <X className="h-4 w-4" />
          </Button>

          {mediaBlob ? (
            <Button
              type="button"
              className="bg-black text-white hover:bg-gray-900"
              size="icon"
              onClick={() => {
                setMediaBlob(null);
                setMediaType(null);
              }}
            >
              <Trash className="h-4 w-4" />
            </Button>
          ) : (
            <>
              <Button
                type="button"
                className="bg-black text-white hover:bg-gray-900"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                className={`bg-black text-white hover:bg-gray-900 ${
                  recording ? "animate-pulse" : ""
                }`}
                size="icon"
                onClick={recording ? stopRecording : startRecording}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </>
          )}

          <input
            type="file"
            ref={fileInputRef}
            accept="audio/*,video/*"
            className="hidden"
            onChange={handleMediaChange}
          />
        </div>
      </form>
    );
  }

  return (
    <div className="pt-2 px-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={enableEditing}
        className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm hover:bg-muted"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add a card
      </Button>
    </div>
  );
});

BoardListCardForm.displayName = "BoardListCardForm";
export default BoardListCardForm;
