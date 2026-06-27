import { Download, FileText } from "lucide-react";
import type { ConversationMessage, DashboardConversation, DashboardMessageRole } from "@/data/messages";
import ParticipantAvatar from "./ParticipantAvatar";

interface MessageThreadProps {
  conversation: DashboardConversation;
  role: DashboardMessageRole;
}

function getSenderId(conversation: DashboardConversation, role: DashboardMessageRole) {
  return role === "mentor" ? conversation.mentor.id : conversation.student.id;
}

function MessageAttachmentCard({ attachment }: { attachment: NonNullable<ConversationMessage["attachments"]>[number] }) {
  return (
    <div className="mt-3 flex max-w-md items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-red-50 text-red-600">
        <FileText className="h-6 w-6" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-bold text-slate-950">{attachment.name}</p>
        <p className="text-xs font-semibold text-slate-500">
          {attachment.size} PDF Document
        </p>
      </div>
      <button
        type="button"
        className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        aria-label={`Download ${attachment.name}`}
      >
        <Download className="h-5 w-5" />
      </button>
    </div>
  );
}

export default function MessageThread({ conversation, role }: MessageThreadProps) {
  const currentSenderId = getSenderId(conversation, role);

  return (
    <section className="flex-1 overflow-y-auto bg-slate-50 px-4 py-6 sm:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-7">
        <div className="self-center rounded-full bg-blue-100 px-5 py-1 text-xs font-semibold text-slate-600">
          Today
        </div>

        {conversation.messages.map((message) => {
          const isCurrentUser = message.senderId === currentSenderId;
          const sender = message.senderId === conversation.mentor.id ? conversation.mentor : conversation.student;

          return (
            <div key={message.id} className={`flex gap-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
              {!isCurrentUser && (
                <div className="self-end">
                  <ParticipantAvatar participant={sender} size="sm" showStatus={false} />
                </div>
              )}

              <div className={`max-w-[min(780px,82%)] ${isCurrentUser ? "items-end" : "items-start"} flex flex-col`}>
                {message.body && (
                  <div
                    className={`rounded-xl border px-5 py-4 text-base leading-7 shadow-sm ${
                      isCurrentUser
                        ? "border-[#0F766E] bg-[#0F766E] text-white shadow-[0_8px_24px_rgba(15,118,110,0.16)]"
                        : "border-slate-300 bg-white text-slate-950"
                    }`}
                  >
                    {message.body}
                  </div>
                )}

                {message.attachments?.map((attachment) => (
                  <MessageAttachmentCard key={attachment.id} attachment={attachment} />
                ))}

                <span className="mt-2 text-xs font-medium text-slate-500">{message.sentAt}</span>
              </div>
            </div>
          );
        })}

        <div className="flex items-center gap-1 pl-8 text-[#0F766E]" aria-label="Mentor is typing">
          <span className="h-2 w-2 rounded-full bg-current" />
          <span className="h-2 w-2 rounded-full bg-current" />
          <span className="h-2 w-2 rounded-full bg-current" />
        </div>
      </div>
    </section>
  );
}

