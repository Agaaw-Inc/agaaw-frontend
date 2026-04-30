import { Bell, FileText, AlertCircle, Calendar, Info } from "lucide-react";
import { MOCK_NOTIFICATIONS } from "@/data/notifications";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'booking': return <Calendar size={12} className="text-white" />;
    case 'document': return <FileText size={12} className="text-white" />;
    case 'system': return <Info size={12} className="text-white" />;
    case 'alert': return <AlertCircle size={12} className="text-white" />;
    default: return <Bell size={12} className="text-white" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'booking': return 'bg-blue-500';
    case 'document': return 'bg-emerald-500';
    case 'system': return 'bg-violet-500';
    case 'alert': return 'bg-amber-500';
    default: return 'bg-gray-500';
  }
};

export default function NotificationsPopover() {
  return (
    <div className="absolute right-0 mt-2 w-[340px] bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[90vh]">
      <div className="flex items-center justify-between px-4 py-3">
        <h3 className="font-bold text-gray-900 text-lg">Notifications</h3>
        <button className="text-sm font-medium text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
          Mark all as read
        </button>
      </div>
      <div className="overflow-y-auto max-h-[400px]">
        {MOCK_NOTIFICATIONS.map(notif => (
          <button key={notif.id} className={`w-full text-left px-4 py-3 flex items-start gap-3 transition-colors ${notif.unread ? 'bg-blue-50/30 hover:bg-blue-50/60' : 'hover:bg-gray-50'}`}>
            <div className="relative shrink-0 mt-1">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 flex items-center justify-center text-white font-bold text-lg">
                A
              </div>
              <div className={`absolute -bottom-1 -right-1 h-6 w-6 rounded-full border-2 border-white flex items-center justify-center ${getNotificationColor(notif.type)}`}>
                {getNotificationIcon(notif.type)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-tight ${notif.unread ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                {notif.text}
              </p>
              <p className={`text-xs mt-1 ${notif.unread ? 'font-semibold text-blue-600' : 'text-gray-500'}`}>
                {notif.time}
              </p>
            </div>
            {notif.unread && (
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-3 relative">
                <div className="absolute inset-0 rounded-full bg-blue-600 animate-ping opacity-75"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
