"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  counterpartFullName,
  getChatMessages,
  getConversations,
  markConversationRead,
  sendChatMessage,
  uploadChatAttachment,
  type ChatAttachment,
  type ChatMessage,
  type ConversationListItem,
} from "@/lib/chat";
import { getChatSocket } from "@/lib/chatSocket";
import { getUserInfo } from "@/lib/auth";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/ui/Toast";
import ConversationHeader from "./ConversationHeader";
import ConversationList from "./ConversationList";
import MessageComposer from "./MessageComposer";
import MessageThread from "./MessageThread";

export type DashboardMessageRole = "student" | "mentor";

interface DashboardMessagesPageProps {
  role: DashboardMessageRole;
}

/** Tell the navbar badge to refresh after reads/new messages. */
function notifyUnreadChanged() {
  window.dispatchEvent(new Event("agaaw-chat-unread-change"));
}

export default function DashboardMessagesPage({ role }: DashboardMessagesPageProps) {
  const { toast, showToast, hideToast } = useToast();

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationListItem[] | null>(null);
  const [listError, setListError] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadLoading, setThreadLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loadingOlder, setLoadingOlder] = useState(false);

  const [draft, setDraft] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [counterpartTyping, setCounterpartTyping] = useState(false);

  // Refs so socket handlers registered once never see stale state
  const activeIdRef = useRef<string | null>(null);
  const currentUserIdRef = useRef<string | null>(null);
  const draftsRef = useRef<Record<string, string>>({});
  const typingSentAtRef = useRef<number | null>(null);
  const typingStopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingClearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initialConversationParam = useRef<string | null>(null);
  const firstConnectRef = useRef(true);

  // ── Conversation list helpers ───────────────────────────────────────────

  const applyMessageToList = useCallback((message: ChatMessage, incrementUnread: boolean) => {
    setConversations((current) => {
      if (!current) return current;
      const index = current.findIndex((c) => c.id === message.conversationId);
      if (index === -1) return current;
      const updated: ConversationListItem = {
        ...current[index],
        lastMessageAt: message.createdAt,
        lastMessage: {
          body: message.body,
          senderId: message.senderId,
          createdAt: message.createdAt,
        },
        unreadCount: incrementUnread
          ? current[index].unreadCount + 1
          : current[index].unreadCount,
      };
      const next = [...current];
      next.splice(index, 1);
      return [updated, ...next];
    });
  }, []);

  const markActiveRead = useCallback((conversationId: string) => {
    markConversationRead(conversationId)
      .then(() => notifyUnreadChanged())
      .catch(() => {
        /* non-critical — retried on next open */
      });
    setConversations((current) =>
      current
        ? current.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
        : current
    );
  }, []);

  const refreshConversations = useCallback(async (pickInitialActive: boolean) => {
    try {
      const list = await getConversations();
      setListError(null);
      setConversations(list);
      if (pickInitialActive) {
        const requested = initialConversationParam.current;
        const initial =
          (requested && list.find((c) => c.id === requested)?.id) || list[0]?.id || null;
        setActiveId((prev) => prev ?? initial);
      }
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Failed to load conversations");
      setConversations((current) => current ?? []);
    }
  }, []);

  // ── Mount: identity, initial load, socket wiring ────────────────────────

  useEffect(() => {
    const user = getUserInfo();
    setCurrentUserId(user?.id ?? null);
    currentUserIdRef.current = user?.id ?? null;

    // Deep-link support: /dashboard/<role>/messages?conversation=<id>
    initialConversationParam.current = new URLSearchParams(window.location.search).get(
      "conversation"
    );

    void refreshConversations(true);

    const socket = getChatSocket();

    const onConnect = () => {
      // Reconnect contract: REST is truth — refetch list + rejoin open thread
      if (firstConnectRef.current) {
        firstConnectRef.current = false;
        return;
      }
      void refreshConversations(false);
      const conversationId = activeIdRef.current;
      if (conversationId) {
        socket.emit("conversation:join", { conversationId });
        getChatMessages(conversationId)
          .then((page) => {
            if (activeIdRef.current !== conversationId) return;
            setMessages([...page.data].reverse());
            setNextCursor(page.meta.nextCursor);
          })
          .catch(() => {});
      }
    };

    const onMessageNew = (message: ChatMessage) => {
      const isOwn = message.senderId === currentUserIdRef.current;
      const isActive = message.conversationId === activeIdRef.current;

      if (isActive) {
        setMessages((current) => {
          if (current.some((m) => m.id === message.id)) return current;
          // Replace the optimistic copy (REST echo raced the socket echo)
          const optimisticIndex = current.findIndex(
            (m) => m.clientRef && m.clientRef === message.clientRef && m.pending
          );
          if (optimisticIndex !== -1) {
            const next = [...current];
            next[optimisticIndex] = message;
            return next;
          }
          return [...current, message];
        });
        setCounterpartTyping(false);
        if (!isOwn) markActiveRead(message.conversationId);
      }

      applyMessageToList(message, !isOwn && !isActive);
      if (!isOwn && !isActive) notifyUnreadChanged();
    };

    const onMessageRead = (payload: { conversationId: string; readAt: string }) => {
      if (payload.conversationId !== activeIdRef.current) return;
      setMessages((current) =>
        current.map((m) =>
          m.senderId === currentUserIdRef.current && !m.readAt
            ? { ...m, readAt: payload.readAt }
            : m
        )
      );
    };

    const onPresenceChanged = (payload: { userId: string; isOnline: boolean }) => {
      setConversations((current) =>
        current
          ? current.map((c) =>
              c.counterpart.id === payload.userId
                ? { ...c, counterpart: { ...c.counterpart, isOnline: payload.isOnline } }
                : c
            )
          : current
      );
    };

    const onTypingStart = (payload: { conversationId: string }) => {
      if (payload.conversationId !== activeIdRef.current) return;
      setCounterpartTyping(true);
      if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
      // Safety: clear even if typing:stop gets lost
      typingClearTimerRef.current = setTimeout(() => setCounterpartTyping(false), 5000);
    };

    const onTypingStop = (payload: { conversationId: string }) => {
      if (payload.conversationId !== activeIdRef.current) return;
      setCounterpartTyping(false);
    };

    socket.on("connect", onConnect);
    socket.on("message:new", onMessageNew);
    socket.on("message:read", onMessageRead);
    socket.on("presence:changed", onPresenceChanged);
    socket.on("typing:start", onTypingStart);
    socket.on("typing:stop", onTypingStop);

    return () => {
      socket.off("connect", onConnect);
      socket.off("message:new", onMessageNew);
      socket.off("message:read", onMessageRead);
      socket.off("presence:changed", onPresenceChanged);
      socket.off("typing:start", onTypingStart);
      socket.off("typing:stop", onTypingStop);
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      if (typingClearTimerRef.current) clearTimeout(typingClearTimerRef.current);
    };
  }, [applyMessageToList, markActiveRead, refreshConversations]);

  // ── Active thread: join room, load page 1, mark read ────────────────────

  useEffect(() => {
    activeIdRef.current = activeId;
    if (!activeId) return;

    const socket = getChatSocket();
    socket.emit("conversation:join", { conversationId: activeId });

    setThreadLoading(true);
    setMessages([]);
    setNextCursor(null);
    setCounterpartTyping(false);
    setPendingAttachments([]);
    setDraft(draftsRef.current[activeId] ?? "");

    let cancelled = false;
    getChatMessages(activeId)
      .then((page) => {
        if (cancelled) return;
        setMessages([...page.data].reverse()); // newest page → render ascending
        setNextCursor(page.meta.nextCursor);
      })
      .catch((err) => {
        if (!cancelled) {
          showToast(err instanceof Error ? err.message : "Failed to load messages", "error");
        }
      })
      .finally(() => {
        if (!cancelled) setThreadLoading(false);
      });

    markActiveRead(activeId);

    return () => {
      cancelled = true;
      socket.emit("conversation:leave", { conversationId: activeId });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  // ── Sending ─────────────────────────────────────────────────────────────

  const deliver = useCallback(
    async (message: ChatMessage) => {
      try {
        const saved = await sendChatMessage(message.conversationId, {
          body: message.body,
          clientRef: message.clientRef!,
          attachmentIds: message.attachments.map((a) => a.id),
        });
        setMessages((current) => {
          const withoutDupes = current.filter(
            (m) => m.id !== saved.id || m.clientRef === message.clientRef
          );
          return withoutDupes.map((m) =>
            m.clientRef === message.clientRef ? { ...saved, pending: false } : m
          );
        });
        applyMessageToList(saved, false);
      } catch (err) {
        setMessages((current) =>
          current.map((m) =>
            m.clientRef === message.clientRef ? { ...m, pending: false, failed: true } : m
          )
        );
        showToast(err instanceof Error ? err.message : "Failed to send message", "error");
      }
    },
    [applyMessageToList, showToast]
  );

  const stopTypingSignal = useCallback((conversationId: string) => {
    if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
    if (typingSentAtRef.current) {
      getChatSocket().emit("typing:stop", { conversationId });
      typingSentAtRef.current = null;
    }
  }, []);

  const activeConversation = useMemo(
    () => conversations?.find((c) => c.id === activeId) ?? null,
    [conversations, activeId]
  );

  const handleSend = useCallback(() => {
    const body = draft.trim();
    if (!activeId || !currentUserId || !activeConversation) return;
    if (activeConversation.connectionStatus !== "active") return;
    if (!body && pendingAttachments.length === 0) return;
    if (body.length > 4000) {
      showToast("Messages are limited to 4000 characters", "error");
      return;
    }

    const clientRef = crypto.randomUUID();
    const optimistic: ChatMessage = {
      id: `local-${clientRef}`,
      conversationId: activeId,
      senderId: currentUserId,
      body,
      clientRef,
      readAt: null,
      createdAt: new Date().toISOString(),
      attachments: pendingAttachments,
      pending: true,
    };

    setMessages((current) => [...current, optimistic]);
    setDraft("");
    draftsRef.current[activeId] = "";
    setPendingAttachments([]);
    stopTypingSignal(activeId);
    void deliver(optimistic);
  }, [
    draft,
    activeId,
    currentUserId,
    activeConversation,
    pendingAttachments,
    deliver,
    stopTypingSignal,
    showToast,
  ]);

  const handleRetry = useCallback(
    (message: ChatMessage) => {
      setMessages((current) =>
        current.map((m) =>
          m.clientRef === message.clientRef ? { ...m, failed: false, pending: true } : m
        )
      );
      void deliver(message);
    },
    [deliver]
  );

  // ── Composer wiring ─────────────────────────────────────────────────────

  const handleDraftChange = useCallback(
    (value: string) => {
      setDraft(value);
      if (!activeId) return;
      draftsRef.current[activeId] = value;

      // typing:start at most every 2s; auto typing:stop after 3s idle
      const socket = getChatSocket();
      const now = Date.now();
      if (value && (!typingSentAtRef.current || now - typingSentAtRef.current > 2000)) {
        socket.emit("typing:start", { conversationId: activeId });
        typingSentAtRef.current = now;
      }
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = setTimeout(() => {
        socket.emit("typing:stop", { conversationId: activeId });
        typingSentAtRef.current = null;
      }, 3000);
    },
    [activeId]
  );

  const handleAttach = useCallback(
    async (file: File) => {
      if (!activeId) return;
      if (file.size > 10 * 1024 * 1024) {
        showToast("Attachments are limited to 10 MB", "error");
        return;
      }
      setUploading(true);
      try {
        const attachment = await uploadChatAttachment(activeId, file);
        setPendingAttachments((current) => [...current, attachment]);
      } catch (err) {
        showToast(err instanceof Error ? err.message : "Failed to upload attachment", "error");
      } finally {
        setUploading(false);
      }
    },
    [activeId, showToast]
  );

  const handleRemoveAttachment = useCallback((attachmentId: string) => {
    // Just drop it locally — never-sent uploads are cleaned up server-side
    setPendingAttachments((current) => current.filter((a) => a.id !== attachmentId));
  }, []);

  const handleLoadOlder = useCallback(async () => {
    if (!activeId || !nextCursor || loadingOlder) return;
    setLoadingOlder(true);
    try {
      const page = await getChatMessages(activeId, nextCursor);
      if (activeIdRef.current === activeId) {
        setMessages((current) => {
          const existingIds = new Set(current.map((m) => m.id));
          const older = [...page.data].reverse().filter((m) => !existingIds.has(m.id));
          return [...older, ...current];
        });
        setNextCursor(page.meta.nextCursor);
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Failed to load older messages", "error");
    } finally {
      setLoadingOlder(false);
    }
  }, [activeId, nextCursor, loadingOlder, showToast]);

  // ── Search (client-side, as designed) ───────────────────────────────────

  const filteredConversations = useMemo(() => {
    if (!conversations) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return conversations;
    return conversations.filter((conversation) => {
      const haystack = [
        counterpartFullName(conversation.counterpart),
        conversation.counterpart.title ?? "",
        conversation.counterpart.location ?? "",
        conversation.subject ?? "",
        conversation.lastMessage?.body ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }, [conversations, query]);

  return (
    <div className="bg-[#F8FAFC] px-0 py-0 lg:px-6 lg:py-6">
      <Toast toast={toast} onHide={hideToast} />
      <div className="mx-auto grid min-h-[calc(100vh-86px)] max-w-7xl overflow-hidden border border-slate-200 bg-white shadow-[0_12px_32px_rgba(15,23,42,0.04)] lg:rounded-xl lg:grid-cols-[360px_minmax(0,1fr)]">
        <ConversationList
          conversations={filteredConversations}
          loading={conversations === null}
          error={listError}
          activeConversationId={activeId}
          query={query}
          onQueryChange={setQuery}
          onSelectConversation={setActiveId}
        />

        <section className="flex min-h-[720px] flex-col lg:min-h-[calc(100vh-96px)]">
          {activeConversation ? (
            <>
              <ConversationHeader conversation={activeConversation} role={role} />
              <MessageThread
                messages={messages}
                currentUserId={currentUserId}
                counterpart={activeConversation.counterpart}
                loading={threadLoading}
                typing={counterpartTyping}
                hasMore={Boolean(nextCursor)}
                loadingOlder={loadingOlder}
                onLoadOlder={handleLoadOlder}
                onRetry={handleRetry}
              />
              <MessageComposer
                draft={draft}
                onDraftChange={handleDraftChange}
                onSend={handleSend}
                readOnly={activeConversation.connectionStatus !== "active"}
                pendingAttachments={pendingAttachments}
                uploading={uploading}
                onAttach={handleAttach}
                onRemoveAttachment={handleRemoveAttachment}
              />
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center px-8 text-center">
              <div>
                <p className="text-lg font-semibold text-slate-900">
                  {conversations === null ? "Loading conversations…" : "No conversation selected"}
                </p>
                {conversations !== null && conversations.length === 0 && (
                  <p className="mt-2 text-sm text-slate-500">
                    {role === "student"
                      ? "Connect with a mentor to start messaging."
                      : "Accept a mentorship request to start messaging."}
                  </p>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
