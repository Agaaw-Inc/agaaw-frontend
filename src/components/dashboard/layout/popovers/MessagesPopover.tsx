import { MoreHorizontal } from "lucide-react";
import { MOCK_MESSAGES } from "@/data/messages";

export default function MessagesPopover() {
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
        <h3 className="font-bold text-gray-900 text-lg">Chats</h3>
        <div className="flex gap-2">
          <button className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {MOCK_MESSAGES.map(msg => (
          <button key={msg.id} className="w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors group">
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center text-white font-bold text-lg">
                {msg.name.charAt(0)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[15px] truncate ${msg.unread ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                {msg.name}
              </p>
              <div className="flex items-center text-xs">
                <p className={`truncate mr-1 ${msg.unread ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                  {msg.preview}
                </p>
                <span className="text-gray-400 shrink-0 whitespace-nowrap">&middot; {msg.time}</span>
              </div>
            </div>
            {msg.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0"></div>
            )}
          </button>
        ))}
      </div>
      <div className="p-2 border-t border-gray-50 bg-gray-50/50">
        <button className="w-full text-center text-sm font-semibold text-blue-600 hover:underline py-2">
          See all in Messenger
        </button>
      </div>
    </div>
  );
}
