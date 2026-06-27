"use client";

import { useMemo, useState } from "react";
import type { ConversationMessage, DashboardConversation, DashboardMessageRole } from "@/data/messages";
import { DASHBOARD_CONVERSATIONS } from "@/data/messages";
import ConversationHeader from "./ConversationHeader";
import ConversationList from "./ConversationList";
import MessageComposer from "./MessageComposer";
import MessageThread from "./MessageThread";

interface DashboardMessagesPageProps {
  role: DashboardMessageRole;
}

function getCurrentSenderId(conversation: DashboardConversation, role: DashboardMessageRole) {
  return role === "mentor" ? conversation.mentor.id : conversation.student.id;
}

export default function DashboardMessagesPage({ role }: DashboardMessagesPageProps) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState("");
  const [conversations, setConversations] = useState<DashboardConversation[]>(DASHBOARD_CONVERSATIONS);
  const [activeConversationId, setActiveConversationId] = useState(DASHBOARD_CONVERSATIONS[0].id);

  const filteredConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) return conversations;

    return conversations.filter((conversation) => {
      const participant = role === "mentor" ? conversation.student : conversation.mentor;
      const searchableText = [
        participant.name,
        participant.title,
        participant.location,
        conversation.subject,
        ...conversation.messages.map((message) => message.body),
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedQuery);
    });
  }, [conversations, query, role]);

  const activeConversation =
    conversations.find((conversation) => conversation.id === activeConversationId) ?? conversations[0];

  const handleSendMessage = () => {
    const messageBody = draft.trim();
    if (!messageBody) return;

    const newMessage: ConversationMessage = {
      id: `local-${Date.now()}`,
      senderId: getCurrentSenderId(activeConversation, role),
      body: messageBody,
      sentAt: "Just now",
    };

    setConversations((currentConversations) =>
      currentConversations.map((conversation) =>
        conversation.id === activeConversation.id
          ? {
              ...conversation,
              lastMessageAt: "Just now",
              messages: [...conversation.messages, newMessage],
            }
          : conversation,
      ),
    );
    setDraft("");
  };

  return (
    <div className="bg-[#F8FAFC] px-0 py-0 lg:px-6 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-86px)] max-w-7xl overflow-hidden border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:rounded-xl lg:grid-cols-[360px_minmax(0,1fr)]">
        <ConversationList
          conversations={filteredConversations}
          activeConversationId={activeConversation.id}
          role={role}
          query={query}
          onQueryChange={setQuery}
          onSelectConversation={setActiveConversationId}
        />

        <section className="flex min-h-[720px] flex-col lg:min-h-[calc(100vh-96px)]">
          <ConversationHeader conversation={activeConversation} role={role} />
          <MessageThread conversation={activeConversation} role={role} />
          <MessageComposer draft={draft} onDraftChange={setDraft} onSend={handleSendMessage} />
        </section>
      </div>
    </div>
  );
}

