export type DashboardMessageRole = "student" | "mentor";

export interface Message {
  id: number;
  name: string;
  preview: string;
  time: string;
  unread: boolean;
}

export interface MessageParticipant {
  id: string;
  name: string;
  role: DashboardMessageRole;
  title: string;
  location: string;
  avatar?: string;
  isOnline?: boolean;
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: "pdf" | "doc" | "image";
  size: string;
}

export interface ConversationMessage {
  id: string;
  senderId: string;
  body: string;
  sentAt: string;
  attachments?: MessageAttachment[];
}

export interface DashboardConversation {
  id: string;
  mentor: MessageParticipant;
  student: MessageParticipant;
  subject: string;
  status: "active" | "waiting" | "scheduled";
  lastMessageAt: string;
  unreadCount: number;
  messages: ConversationMessage[];
}

export const CURRENT_MESSAGE_USERS: Record<DashboardMessageRole, MessageParticipant> = {
  student: {
    id: "student-fahim",
    name: "Fahim Karim",
    role: "student",
    title: "Prospective MSc applicant",
    location: "Dhaka, Bangladesh",
    isOnline: true,
  },
  mentor: {
    id: "mentor-nadia",
    name: "Nadia Islam",
    role: "mentor",
    title: "German University Expert",
    location: "Munich, Germany",
    avatar: "/mentors/mentor_1.png",
    isOnline: true,
  },
};

const students: MessageParticipant[] = [
  CURRENT_MESSAGE_USERS.student,
  {
    id: "student-tanvir",
    name: "Tanvir Hasan",
    role: "student",
    title: "DAAD scholarship applicant",
    location: "Sylhet, Bangladesh",
    isOnline: false,
  },
  {
    id: "student-sarah",
    name: "Sarah Ahmed",
    role: "student",
    title: "Research proposal review",
    location: "Chittagong, Bangladesh",
    isOnline: true,
  },
];

const mentors: MessageParticipant[] = [
  CURRENT_MESSAGE_USERS.mentor,
  {
    id: "mentor-fuad",
    name: "Fuad Rahman",
    role: "mentor",
    title: "Commonwealth Scholar",
    location: "London, United Kingdom",
    avatar: "/mentors/fuad.JPG",
    isOnline: false,
  },
  {
    id: "mentor-chen",
    name: "Dr. Sarah Chen",
    role: "mentor",
    title: "Research Proposal Coach",
    location: "Toronto, Canada",
    avatar: "/mentors/mentor_3.png",
    isOnline: false,
  },
];

export const DASHBOARD_CONVERSATIONS: DashboardConversation[] = [
  {
    id: "conversation-nadia-fahim",
    mentor: mentors[0],
    student: students[0],
    subject: "Personal statement review",
    status: "active",
    lastMessageAt: "10:24 AM",
    unreadCount: 2,
    messages: [
      {
        id: "msg-1",
        senderId: "mentor-nadia",
        body: "Hi there! I've finished reviewing your latest draft of the Personal Statement for the Technical University of Munich. Overall, it's very strong.",
        sentAt: "10:20 AM",
      },
      {
        id: "msg-2",
        senderId: "student-fahim",
        body: "Thank you so much, Nadia! I was a bit worried about the introduction. Did it sound too generic?",
        sentAt: "10:22 AM",
      },
      {
        id: "msg-3",
        senderId: "mentor-nadia",
        body: "Not at all. You just needed to tie your past projects more directly to their research goals. I've attached some suggested edits below.",
        sentAt: "10:24 AM",
        attachments: [
          {
            id: "attachment-statement-edits",
            name: "Personal_Statement_v2_EDITS.pdf",
            type: "pdf",
            size: "1.4 MB",
          },
        ],
      },
    ],
  },
  {
    id: "conversation-fuad-tanvir",
    mentor: mentors[1],
    student: students[1],
    subject: "DAAD portal checklist",
    status: "waiting",
    lastMessageAt: "Yesterday",
    unreadCount: 0,
    messages: [
      {
        id: "msg-4",
        senderId: "student-tanvir",
        body: "Have you checked the DAAD portal? I am not sure whether the motivation letter should be uploaded under study plan or additional documents.",
        sentAt: "Yesterday",
      },
      {
        id: "msg-5",
        senderId: "mentor-fuad",
        body: "Upload the final motivation letter under study plan. Keep the scholarship-specific declaration in additional documents.",
        sentAt: "Yesterday",
      },
    ],
  },
  {
    id: "conversation-chen-sarah",
    mentor: mentors[2],
    student: students[2],
    subject: "Research proposal feedback",
    status: "scheduled",
    lastMessageAt: "Oct 12",
    unreadCount: 0,
    messages: [
      {
        id: "msg-6",
        senderId: "mentor-chen",
        body: "The research proposal looks solid. For our next session, bring a sharper problem statement and two papers you want to build on.",
        sentAt: "Oct 12",
      },
      {
        id: "msg-7",
        senderId: "student-sarah",
        body: "Got it. I will update the problem statement tonight and share the references before the session.",
        sentAt: "Oct 12",
      },
    ],
  },
];

export const MOCK_MESSAGES: Message[] = DASHBOARD_CONVERSATIONS.map((conversation, index) => {
  const otherParticipant = index === 0 ? conversation.mentor : conversation.student;
  const lastMessage = conversation.messages[conversation.messages.length - 1];

  return {
    id: index + 1,
    name: otherParticipant.name,
    preview: lastMessage.body,
    time: conversation.lastMessageAt,
    unread: conversation.unreadCount > 0,
  };
});

