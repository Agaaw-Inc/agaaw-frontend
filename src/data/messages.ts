export interface Message {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
}

export const MOCK_MESSAGES: Message[] = [
  { id: 1, name: "Sarah Johnson", preview: "Thanks for the feedback on my essay!", time: "2m", unread: true },
  { id: 2, name: "Ahmed Hassan", preview: "Are you available for a mock interview tomorrow?", time: "1h", unread: true },
  { id: 3, name: "Maria Garcia", preview: "I've submitted my application to Oxford.", time: "1d", unread: false },
  { id: 4, name: "David Chen", preview: "Can we review my scholarship list?", time: "3d", unread: false },
];
