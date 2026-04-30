export type NotificationType = 'booking' | 'document' | 'system' | 'alert' | 'general';

export interface Notification {
  id: number;
  text: string;
  time: string;
  type: NotificationType;
  unread: boolean;
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 1, text: "Sarah Johnson booked a session with you.", time: "5m ago", type: "booking", unread: true },
  { id: 2, text: "Ahmed Hassan sent you a document.", time: "2h ago", type: "document", unread: true },
  { id: 3, text: "Your profile visibility increased by 15% this week.", time: "1d ago", type: "system", unread: false },
  { id: 4, text: "New scholarship matching your expertise was added.", time: "2d ago", type: "alert", unread: false },
];
