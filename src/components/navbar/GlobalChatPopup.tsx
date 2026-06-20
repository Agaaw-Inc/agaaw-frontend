"use client";

import React, { useState } from "react";
import { MessageSquare, X, Send, User } from "lucide-react";

export default function GlobalChatPopup() {
    const [isOpen, setIsOpen] = useState(false);

    React.useEffect(() => {
        const handleOpenChat = () => setIsOpen(true);
        window.addEventListener('open-chat', handleOpenChat);
        return () => window.removeEventListener('open-chat', handleOpenChat);
    }, []);

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-teal-600 hover:bg-teal-700 text-white p-4 rounded-full shadow-2xl transition-transform hover:scale-105 z-50 flex items-center justify-center"
            >
                <MessageSquare size={24} />
                <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
            {/* Header */}
            <div className="bg-teal-700 p-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                        <User size={16} className="text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Messages</h3>
                        <p className="text-[10px] text-teal-100">Reply to your recent chats</p>
                    </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-teal-100 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Chat Body */}
            <div className="h-80 bg-gray-50 p-4 overflow-y-auto flex flex-col gap-3">
                <div className="flex flex-col gap-1 items-start">
                    <span className="text-[10px] text-gray-400 font-semibold mx-2">Today, 10:24 AM</span>
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm p-3 shadow-sm text-sm text-gray-700 max-w-[80%]">
                        Hello! I wanted to follow up on the SOP revisions we discussed.
                    </div>
                </div>

                <div className="flex flex-col gap-1 items-end mt-2">
                    <span className="text-[10px] text-gray-400 font-semibold mx-2">Today, 10:30 AM</span>
                    <div className="bg-teal-600 text-white rounded-2xl rounded-tr-sm p-3 shadow-sm text-sm max-w-[80%]">
                        Sure thing. I just left some comments on the document. Check it out when you can!
                    </div>
                </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
                <input
                    type="text"
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
                />
                <button className="bg-teal-600 hover:bg-teal-700 text-white w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors">
                    <Send size={16} className="-ml-0.5" />
                </button>
            </div>
        </div>
    );
}
