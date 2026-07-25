import { Search } from "lucide-react";
import {
  counterpartFullName,
  formatConversationTime,
  type ConversationListItem,
} from "@/lib/chat";
import ParticipantAvatar from "./ParticipantAvatar";

interface ConversationListProps {
  conversations: ConversationListItem[];
  loading: boolean;
  error: string | null;
  activeConversationId: string | null;
  query: string;
  onQueryChange: (query: string) => void;
  onSelectConversation: (conversationId: string) => void;
}

export default function ConversationList({
  conversations,
  loading,
  error,
  activeConversationId,
  query,
  onQueryChange,
  onSelectConversation,
}: ConversationListProps) {
  return (
    <aside className="flex min-h-[720px] flex-col border-r border-slate-200 bg-white lg:min-h-[calc(100vh-96px)]">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#20B2AA]">Agaaw inbox</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-950">Messages</h1>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            {conversations.length} chats
          </span>
        </div>

        <label className="mt-5 flex items-center gap-3 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 transition focus-within:border-[#20B2AA] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#20B2AA]/15">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="Search conversations..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-500"
            type="search"
          />
        </label>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-slate-500">Loading conversations…</p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-red-500">{error}</p>
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => {
            const { counterpart } = conversation;
            const isActive = conversation.id === activeConversationId;

            return (
              <button
                key={conversation.id}
                type="button"
                onClick={() => onSelectConversation(conversation.id)}
                className={`group flex w-full gap-3 rounded-lg border p-3 text-left transition hover:-translate-y-px ${
                  isActive
                    ? "border-[#20B2AA]/20 bg-[#20B2AA]/[0.08] shadow-[0_4px_16px_rgba(15,23,42,0.04)]"
                    : "border-transparent bg-white hover:border-slate-200 hover:bg-slate-50"
                }`}
              >
                <ParticipantAvatar participant={counterpart} size="md" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {counterpartFullName(counterpart)}
                      </p>
                      <p className="truncate text-xs font-medium text-slate-500">
                        {counterpart.title || conversation.subject || ""}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-medium text-slate-500">
                      {formatConversationTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">
                    {conversation.lastMessage?.body || "No messages yet — say hello!"}
                  </p>
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        conversation.connectionStatus === "active"
                          ? "bg-slate-100 text-slate-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {conversation.connectionStatus === "active" ? "Active" : "Ended"}
                    </span>
                    {conversation.unreadCount > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F172A] px-1.5 text-[11px] font-bold text-white">
                        {conversation.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center">
            <p className="text-sm font-medium text-slate-500">
              {query ? "No conversations match your search." : "No conversations yet."}
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
