"use client";

import { createCard } from "@/actions/create-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ListWithCards } from "@/types";
import { Sparkles, X, Loader2, Mic, Paperclip, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ExtractedTask {
  title: string;
  priority: "high" | "medium" | "low";
  deadline: string | null;
  assignee: string | null;
  description: string;
  sourceSentence: string;
  mediaBlob: Blob | null;
  mediaType: "audio" | "video" | null;
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-100 text-red-700 border-red-200",
  medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
  low: "bg-green-100 text-green-700 border-green-200",
};

const PRIORITY_CYCLE: Record<string, "high" | "medium" | "low"> = {
  high: "medium",
  medium: "low",
  low: "high",
};

interface TaskExtractorProps {
  lists: ListWithCards[];
}

export default function TaskExtractor({ lists }: TaskExtractorProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [tasks, setTasks] = useState<ExtractedTask[]>([]);
  const [selectedListId, setSelectedListId] = useState(lists[0]?.id ?? "");
  const [extracting, setExtracting] = useState(false);
  const [creating, setCreating] = useState(false);

  // Per-task recording state
  const [recordingIdx, setRecordingIdx] = useState<number | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileTargetIdx, setFileTargetIdx] = useState<number | null>(null);

  const handleClose = (v: boolean) => {
    setOpen(v);
    if (!v) {
      stopRecording();
      setText("");
      setTasks([]);
    }
  };

  // -------------------------------------------------------------------------
  // Extraction
  // -------------------------------------------------------------------------
  const handleExtract = async () => {
    if (!text.trim()) return;
    setExtracting(true);
    setTasks([]);

    try {
      const res = await fetch("/api/extract-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Extraction failed");
      }

      const data = await res.json();
      setTasks(
        (data.tasks ?? []).map((t: any) => ({
          title: t.title,
          priority: t.priority ?? "medium",
          deadline: t.deadline ?? null,
          assignee: t.assignee ?? null,
          sourceSentence: t.source_sentence ?? "",
          description: buildDescription(t),
          mediaBlob: null,
          mediaType: null,
        }))
      );
    } catch (e: any) {
      toast.error(e.message ?? "Failed to extract tasks.");
    } finally {
      setExtracting(false);
    }
  };

  const buildDescription = (t: any): string => {
    const lines: string[] = [];
    if (t.source_sentence) lines.push(t.source_sentence);
    const meta: string[] = [];
    if (t.assignee) meta.push(`Assigned to: ${t.assignee}`);
    if (t.deadline) meta.push(`Due: ${t.deadline}`);
    if (t.priority && t.priority !== "medium") meta.push(`Priority: ${t.priority}`);
    if (meta.length > 0) lines.push(meta.join(" | "));
    return lines.join("\n");
  };

  // -------------------------------------------------------------------------
  // Task field updates
  // -------------------------------------------------------------------------
  const updateTitle = (idx: number, value: string) =>
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, title: value } : t)));

  const updateDescription = (idx: number, value: string) =>
    setTasks((prev) => prev.map((t, i) => (i === idx ? { ...t, description: value } : t)));

  const cyclePriority = (idx: number) =>
    setTasks((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, priority: PRIORITY_CYCLE[t.priority] } : t))
    );

  const removeTask = (idx: number) =>
    setTasks((prev) => prev.filter((_, i) => i !== idx));

  const setTaskMedia = (idx: number, blob: Blob | null, type: "audio" | "video" | null) =>
    setTasks((prev) =>
      prev.map((t, i) => (i === idx ? { ...t, mediaBlob: blob, mediaType: type } : t))
    );

  // -------------------------------------------------------------------------
  // Per-task audio recording
  // -------------------------------------------------------------------------
  const startRecording = async (idx: number) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setTaskMedia(idx, blob, "audio");
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecordingIdx(idx);
    } catch {
      toast.error("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    mediaRecorder?.stop();
    mediaRecorder?.stream.getTracks().forEach((t) => t.stop());
    setMediaRecorder(null);
    setRecordingIdx(null);
  };

  // -------------------------------------------------------------------------
  // Per-task file upload
  // -------------------------------------------------------------------------
  const openFilePicker = (idx: number) => {
    setFileTargetIdx(idx);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || fileTargetIdx === null) return;

    const type = file.type.startsWith("video")
      ? "video"
      : file.type.startsWith("audio")
      ? "audio"
      : null;

    if (!type) {
      toast.error("Only audio or video files are allowed.");
      return;
    }

    setTaskMedia(fileTargetIdx, file, type);
    e.target.value = "";
    setFileTargetIdx(null);
  };

  // -------------------------------------------------------------------------
  // Upload media blob to Azure via SAS
  // -------------------------------------------------------------------------
  const uploadMedia = async (blob: Blob, type: "audio" | "video") => {
    const fileName =
      blob instanceof File ? blob.name : `recording.${type === "audio" ? "webm" : "mp4"}`;

    const getUrlRes = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fileName }),
    });

    if (!getUrlRes.ok) throw new Error("Failed to get SAS upload URL");

    const { uploadUrl, mediaUrl } = await getUrlRes.json();

    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "x-ms-blob-type": "BlockBlob", "Content-Type": blob.type },
      body: blob,
    });

    if (!uploadRes.ok) throw new Error("Upload to Azure failed");

    return { mediaUrl, mediaType: type };
  };

  // -------------------------------------------------------------------------
  // Create all cards
  // -------------------------------------------------------------------------
  const handleCreateAll = async () => {
    if (!selectedListId || tasks.length === 0) return;
    setCreating(true);

    let created = 0;
    let failed = 0;

    for (const task of tasks) {
      try {
        let mediaUrl: string | undefined;
        let mediaType: "audio" | "video" | undefined;

        if (task.mediaBlob && task.mediaType) {
          const uploaded = await uploadMedia(task.mediaBlob, task.mediaType);
          mediaUrl = uploaded.mediaUrl;
          mediaType = uploaded.mediaType;
        }

        const result = await createCard({
          title: task.title,
          listId: selectedListId,
          description: task.description || undefined,
          mediaUrl,
          mediaType,
        });

        if (result.error) {
          failed++;
        } else {
          created++;
        }
      } catch {
        failed++;
      }
    }

    setCreating(false);

    if (created > 0) toast.success(`Created ${created} card${created !== 1 ? "s" : ""}!`);
    if (failed > 0) toast.error(`${failed} card${failed !== 1 ? "s" : ""} failed.`);
    if (created > 0) handleClose(false);
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-medium text-sm px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Sparkles className="h-4 w-4" />
        Extract Tasks
      </button>

      {/* Hidden file input shared across all tasks */}
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*,video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-5 w-5 text-violet-600" />
              AI Task Extractor
              <span className="text-xs font-normal text-neutral-400 ml-1">spaCy NLP</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-2">
            <p className="text-sm text-neutral-500">
              Paste meeting notes, a Slack message, or any text. spaCy splits sentences and
              extracts names, dates, and priorities automatically.
            </p>

            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={`e.g. "Aditya needs to fix the auth bug by Friday, it's urgent. Rahul should handle the DB migration before next sprint…"`}
              className="min-h-[130px] text-sm resize-none"
              disabled={extracting}
            />

            <Button
              onClick={handleExtract}
              disabled={!text.trim() || extracting}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            >
              {extracting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Extract Tasks
                </>
              )}
            </Button>

            {tasks.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-neutral-700">
                  Found {tasks.length} task{tasks.length !== 1 ? "s" : ""}
                  <span className="text-xs font-normal text-neutral-400 ml-2">
                    Edit inline · click priority to cycle · attach audio/video per card
                  </span>
                </p>

                <div className="space-y-3">
                  {tasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-neutral-50 border border-neutral-200 rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        {/* Title */}
                        <input
                          className="w-full text-sm font-medium bg-transparent border-b border-transparent hover:border-neutral-300 focus:border-violet-400 outline-none transition-colors pb-0.5"
                          value={task.title}
                          onChange={(e) => updateTitle(idx, e.target.value)}
                        />

                        {/* Badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => cyclePriority(idx)}
                            className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize transition-colors cursor-pointer ${PRIORITY_COLORS[task.priority]}`}
                          >
                            {task.priority}
                          </button>
                          {task.deadline && (
                            <span className="text-xs text-neutral-500 bg-white border border-neutral-200 px-2 py-0.5 rounded-full">
                              {task.deadline}
                            </span>
                          )}
                          {task.assignee && (
                            <span className="text-xs text-blue-600 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-full">
                              @{task.assignee}
                            </span>
                          )}
                        </div>

                        {/* Description */}
                        <textarea
                          rows={2}
                          value={task.description}
                          onChange={(e) => updateDescription(idx, e.target.value)}
                          placeholder="Description (auto-filled, editable)"
                          className="w-full text-xs text-neutral-500 bg-white border border-neutral-200 rounded px-2 py-1.5 resize-none focus:outline-none focus:ring-1 focus:ring-violet-400"
                        />

                        {/* Media section */}
                        {task.mediaBlob ? (
                          <div className="space-y-1">
                            {task.mediaType === "audio" && (
                              <audio
                                controls
                                src={URL.createObjectURL(task.mediaBlob)}
                                className="w-full h-8"
                              />
                            )}
                            {task.mediaType === "video" && (
                              <video
                                controls
                                src={URL.createObjectURL(task.mediaBlob)}
                                className="w-full rounded"
                              />
                            )}
                            <button
                              onClick={() => setTaskMedia(idx, null, null)}
                              className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                              Remove media
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-400">Attach media:</span>
                            <button
                              onClick={() =>
                                recordingIdx === idx ? stopRecording() : startRecording(idx)
                              }
                              className={`flex items-center gap-1 text-xs px-2 py-1 rounded border transition-colors ${
                                recordingIdx === idx
                                  ? "bg-red-50 border-red-200 text-red-600 animate-pulse"
                                  : "bg-white border-neutral-200 text-neutral-600 hover:border-violet-300"
                              }`}
                            >
                              <Mic className="h-3 w-3" />
                              {recordingIdx === idx ? "Stop" : "Record"}
                            </button>
                            <button
                              onClick={() => openFilePicker(idx)}
                              className="flex items-center gap-1 text-xs px-2 py-1 rounded border bg-white border-neutral-200 text-neutral-600 hover:border-violet-300 transition-colors"
                            >
                              <Paperclip className="h-3 w-3" />
                              File
                            </button>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => removeTask(idx)}
                        className="text-neutral-400 hover:text-red-500 transition-colors mt-0.5 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* List selector + create */}
                <div className="flex items-end gap-3 pt-1">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-neutral-500 mb-1.5 block">
                      Add all to list
                    </label>
                    <select
                      value={selectedListId}
                      onChange={(e) => setSelectedListId(e.target.value)}
                      className="w-full text-sm border border-neutral-200 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-violet-400"
                    >
                      {lists.map((list) => (
                        <option key={list.id} value={list.id}>
                          {list.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button
                    onClick={handleCreateAll}
                    disabled={creating || tasks.length === 0 || !selectedListId}
                    className="bg-black text-white hover:bg-gray-800 shrink-0"
                  >
                    {creating ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creating…
                      </>
                    ) : (
                      `Create ${tasks.length} Card${tasks.length !== 1 ? "s" : ""}`
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
