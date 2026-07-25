"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, CheckCheck, Download, FileText, ImageIcon, RotateCcw } from "lucide-react";
import {
  downloadChatAttachment,
  formatDayLabel,
  formatFileSize,
  formatMessageTime,
  isSameChatDay,
  type ChatAttachment,
  type ChatCounterpart,
  type ChatMessage,
} from "@/lib/chat";
import ParticipantAvatar from "./ParticipantAvatar";

interface MessageThreadProps {
  messages: ChatMessage[];
  currentUserId: string | null;
  counterpart: ChatCounterpart;
  loading: boolean;
  typing: boolean;
  hasMore: boolean;
  loadingOlder: boolean;
  onLoadOlder: () => void;
  onRetry: (message: ChatMessage) => void;
}

const attachmentTypeLabel = { pdf: "PDF Document", doc: "Document", image: "Image" };

function MessageAttachmentCard({ attachment }: { attachment: ChatAttachment }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadChatAttachment(attachment);
    } catch {
      /* transient network failure — user can click again */
    } finally {
      setDownloading(false);
    }
  };

  const Icon = attachment.type === "image" ? ImageIcon : FileText;

  return (
    <div className="mt-3 flex max-w-md items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
        <Icon className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-950">{attachment.name}</p>
        <p className="text-xs font-semibold text-slate-500">
          {formatFileSize(attachment.sizeBytes)} {attachmentTypeLabel[attachment.type]}
        </p>
      </div>
      <button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-50"
        aria-label={`Download ${attachment.name}`}
      >
        <Download className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function MessageThread({
  messages,
  currentUserId,
  counterpart,
  loading,
  typing,
  hasMore,
  loadingOlder,
  onLoadOlder,
  onRetry,
}: MessageThreadProps) {
  const scrollRef = useRef<HTMLElement | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Stick to the bottom when a new message is appended (not when older
  // messages are prepended by pagination).
  useEffect(() => {
    const container = scrollRef.current;
    if (!container || messages.length === 0) return;
    const lastId = messages[messages.length - 1].id;
    if (lastId !== lastMessageIdRef.current) {
      lastMessageIdRef.current = lastId;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typing) {
      const container = scrollRef.current;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }, [typing]);

  const lastOwnReadId = [...messages]
    .reverse()
    .find((m) => m.senderId === currentUserId && m.readAt)?.id;

  return (
    <section ref={scrollRef} className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-7">
        {hasMore && (
          <button
            type="button"
            onClick={onLoadOlder}
            disabled={loadingOlder}
            className="self-center rounded-full border border-slate-200 bg-white px-5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition hover:bg-slate-100 disabled:opacity-50"
          >
            {loadingOlder ? "Loading…" : "Load earlier messages"}
          </button>
        )}

        {loading ? (
          <p className="self-center py-10 text-sm font-medium text-slate-500">Loading messages…</p>
        ) : messages.length === 0 ? (
          <p className="self-center py-10 text-sm font-medium text-slate-500">
            No messages yet — start the conversation!
          </p>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.senderId === currentUserId;
            const previous = messages[index - 1];
            const showDayDivider =
              !previous || !isSameChatDay(previous.createdAt, message.createdAt);

            return (
              <div key={message.id} className="contents">
                {showDayDivider && (
                  <div className="self-center rounded-full bg-blue-100 px-5 py-1 text-xs font-semibold text-slate-600">
                    {formatDayLabel(message.createdAt)}
                  </div>
                )}

                <div className={`flex gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  {!isCurrentUser && (
                    <div className="self-end">
                      <ParticipantAvatar participant={counterpart} size="sm" showStatus={false} />
                    </div>
                  )}

                  <div
                    className={`max-w-[min(780px,82%)] ${
                      isCurrentUser ? "items-end" : "items-start"
                    } flex flex-col`}
                  >
                    {message.body && (
                      <div
                        className={`whitespace-pre-wrap break-words rounded-xl border px-5 py-4 text-base leading-7 shadow-sm ${
                          isCurrentUser
                            ? "border-[#0F766E] bg-[#0F766E] text-white shadow-[0_8px_24px_rgba(15,118,110,0.16)]"
                            : "border-slate-300 bg-white text-slate-950"
                        } ${message.pending ? "opacity-70" : ""} ${
                          message.failed ? "border-red-400" : ""
                        }`}
                      >
                        {message.body}
                      </div>
                    )}

                    {message.attachments?.map((attachment) => (
                      <MessageAttachmentCard key={attachment.id} attachment={attachment} />
                    ))}

                    <span className="mt-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      {message.failed ? (
                        <button
                          type="button"
                          onClick={() => onRetry(message)}
                          className="inline-flex items-center gap-1 font-semibold text-red-500 transition hover:text-red-600"
                        >
                          <AlertCircle className="h-3.5 w-3.5" />
                          Failed to send — retry
                          <RotateCcw className="h-3 w-3" />
                        </button>
                      ) : (
                        <>
                          {message.pending ? "Sending…" : formatMessageTime(message.createdAt)}
                          {isCurrentUser && !message.pending && (
                            message.id === lastOwnReadId ? (
                              <span className="inline-flex items-center gap-0.5 text-[#0F766E]">
                                <CheckCheck className="h-3.5 w-3.5" />
                                Seen
                              </span>
                            ) : (
                              <Check className="h-3.5 w-3.5" />
                            )
                          )}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {typing && (
          <div
            className="flex items-center gap-1 pl-12 text-[#0F766E]"
            aria-label={`${counterpart.firstName} is typing`}
          >
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
          </div>
        )}
      </div>
    </section>
  );
}
