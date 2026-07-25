"use client";

import { useRef } from "react";
import { FileText, ImageIcon, Loader2, Paperclip, SendHorizontal, X } from "lucide-react";
import { formatFileSize, type ChatAttachment } from "@/lib/chat";

interface MessageComposerProps {
  draft: string;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  readOnly: boolean;
  pendingAttachments: ChatAttachment[];
  uploading: boolean;
  onAttach: (file: File) => void;
  onRemoveAttachment: (attachmentId: string) => void;
}

const DOC_ACCEPT = ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

export default function MessageComposer({
  draft,
  onDraftChange,
  onSend,
  readOnly,
  pendingAttachments,
  uploading,
  onAttach,
  onRemoveAttachment,
}: MessageComposerProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onAttach(file);
    event.target.value = ""; // allow re-selecting the same file
  };

  if (readOnly) {
    return (
      <footer className="border-t border-slate-200 bg-white px-4 py-5 sm:px-8">
        <p className="mx-auto max-w-5xl text-center text-sm font-medium text-slate-500">
          This mentorship connection has ended — the conversation is read-only.
        </p>
      </footer>
    );
  }

  const canSend = (draft.trim().length > 0 || pendingAttachments.length > 0) && !uploading;

  return (
    <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {pendingAttachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {pendingAttachments.map((attachment) => (
              <span
                key={attachment.id}
                className="inline-flex max-w-xs items-center gap-2 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-3 pr-1.5 text-xs font-semibold text-slate-700"
              >
                <FileText className="h-3.5 w-3.5 shrink-0 text-[#0F766E]" />
                <span className="truncate">{attachment.name}</span>
                <span className="shrink-0 text-slate-400">{formatFileSize(attachment.sizeBytes)}</span>
                <button
                  type="button"
                  onClick={() => onRemoveAttachment(attachment.id)}
                  className="rounded-full p-1 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                  aria-label={`Remove ${attachment.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end gap-3 rounded-xl border border-slate-300 bg-slate-50 p-2 shadow-sm transition focus-within:border-[#20B2AA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#20B2AA]/15">
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (canSend) onSend();
              }
            }}
            rows={1}
            maxLength={4000}
            placeholder="Type your message..."
            className="max-h-32 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-base leading-6 text-slate-900 outline-none placeholder:text-slate-500"
          />
          <button
            type="button"
            onClick={onSend}
            disabled={!canSend}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#0F766E] text-white shadow-sm transition hover:-translate-y-px hover:bg-[#0B625C] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:hover:translate-y-0"
            aria-label="Send message"
          >
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <SendHorizontal className="h-5 w-5" />
            )}
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={DOC_ACCEPT}
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={imageInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 transition hover:text-slate-900 disabled:opacity-50"
            >
              <Paperclip className="h-4 w-4" />
              Attach File
            </button>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={uploading}
              className="inline-flex items-center gap-2 transition hover:text-slate-900 disabled:opacity-50"
            >
              <ImageIcon className="h-4 w-4" />
              Image
            </button>
            {uploading && <span className="text-[#0F766E]">Uploading…</span>}
          </div>
          <p className="text-slate-400">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </footer>
  );
}
