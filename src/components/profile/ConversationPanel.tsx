"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, FileText, MessageSquare, Package } from "lucide-react";
import type { ConversationMessage } from "@/data/profileTypes";

interface ConversationPanelProps {
  messages: ConversationMessage[];
  currentUserUsername: string;
}

export default function ConversationPanel({
  messages,
  currentUserUsername,
}: ConversationPanelProps) {
  const [activeTab, setActiveTab] = useState<"chat" | "proposals" | "documents">("chat");
  const [localMessages, setLocalMessages] = useState(messages);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    setLocalMessages([
      ...localMessages,
      {
        id: `m-${Date.now()}`,
        senderId: currentUserUsername,
        senderName: "You",
        text: newMessage.trim(),
        timestamp: new Date().toISOString(),
      },
    ]);
    setNewMessage("");
  };

  const tabs = [
    { id: "chat" as const, label: "Chat", icon: MessageSquare },
    { id: "proposals" as const, label: "Proposals", icon: Package },
    { id: "documents" as const, label: "Documents", icon: FileText },
  ];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
      {/* Tab bar */}
      <div className="flex border-b border-gray-100 px-2 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === tab.id
                ? "text-teal-700 bg-teal-50 border-b-2 border-teal-600"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chat tab */}
      {activeTab === "chat" && (
        <>
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {localMessages.map((msg) => {
              const isSelf = msg.senderId === currentUserUsername;
              return (
                <div
                  key={msg.id}
                  className={`flex ${isSelf ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isSelf
                        ? "bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {!isSelf && (
                      <p className="text-[10px] font-semibold text-teal-600 mb-0.5">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p
                      className={`text-[10px] mt-1 ${
                        isSelf ? "text-teal-200" : "text-gray-400"
                      } text-right`}
                    >
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-100 p-3">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip size={18} />
              </button>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim()}
                className="p-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Proposals tab */}
      {activeTab === "proposals" && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <Package size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400 mb-1">
              Proposals will appear here
            </p>
            <p className="text-xs text-gray-300">
              When a mentor sends you a service proposal, it shows up in this tab.
            </p>
          </div>
        </div>
      )}

      {/* Documents tab */}
      {activeTab === "documents" && (
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <FileText size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm text-gray-400 mb-1">
              Shared documents will appear here
            </p>
            <p className="text-xs text-gray-300">
              CVs, essays, and other documents shared during the conversation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
