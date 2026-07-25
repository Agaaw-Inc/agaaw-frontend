"use client";

import { useEffect, useState } from "react";
import { getUnreadMessageCount } from "@/lib/chat";
import { disconnectChatSocket, getChatSocket } from "@/lib/chatSocket";
import { getToken, getUserInfo } from "@/lib/auth";

/**
 * Live unread-messages total for the navbar badge.
 *
 * Also keeps the shared chat socket connected while the user browses the
 * rest of the site, which is what makes presence ("Active now") and instant
 * badge updates work outside the messages page.
 */
export function useUnreadMessages(loggedIn: boolean): number {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!loggedIn || !getToken()) {
      disconnectChatSocket();
      setUnread(0);
      return;
    }

    let cancelled = false;
    const refresh = () => {
      getUnreadMessageCount()
        .then((total) => {
          if (!cancelled) setUnread(total);
        })
        .catch(() => {});
    };

    refresh();

    const socket = getChatSocket();
    const userId = getUserInfo()?.id;
    const onMessageNew = (message: { senderId?: string }) => {
      if (message?.senderId !== userId) refresh();
    };

    socket.on("message:new", onMessageNew);
    socket.on("connect", refresh);
    window.addEventListener("agaaw-chat-unread-change", refresh);

    return () => {
      cancelled = true;
      socket.off("message:new", onMessageNew);
      socket.off("connect", refresh);
      window.removeEventListener("agaaw-chat-unread-change", refresh);
    };
  }, [loggedIn]);

  return unread;
}
