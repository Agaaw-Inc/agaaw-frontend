import type {
  MentorProfile,
  StudentProfile,
  UserProfile,
  Conversation,
} from "@/data/profileTypes";

// ─── Conversations ───────────────────────────────────────────────

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "conv-1",
    participants: {
      mentorUsername: "arif-rahman",
      studentUsername: "omar-faruk",
    },
    status: "in-progress",
    proposalTitle: "Full Application Review — Oxford PhD",
    proposalDescription:
      "Complete review of PhD application materials including research proposal, personal statement, CV, and reference letter strategy for University of Oxford.",
    proposalPrice: 120,
    messages: [
      {
        id: "m1",
        senderId: "omar-faruk",
        senderName: "Omar Faruk",
        text: "Hi Arif! I'm interested in your Full Application Review service for my Oxford PhD application. Could you help?",
        timestamp: "2026-04-08T10:00:00Z",
      },
      {
        id: "m2",
        senderId: "arif-rahman",
        senderName: "Arif Rahman",
        text: "Hello Omar! I'd be happy to help. I've guided several students through the Oxford application process. Could you share your research proposal draft and CV?",
        timestamp: "2026-04-08T10:15:00Z",
      },
      {
        id: "m3",
        senderId: "omar-faruk",
        senderName: "Omar Faruk",
        text: "Of course! I'll upload my research proposal and CV. My research is focused on computer vision and deep learning. I'm targeting the CS department.",
        timestamp: "2026-04-08T10:30:00Z",
      },
      {
        id: "m4",
        senderId: "arif-rahman",
        senderName: "Arif Rahman",
        text: "Great focus area! Oxford has excellent AI research groups. I'll review everything and send detailed feedback within 48 hours. Let's also discuss potential supervisors.",
        timestamp: "2026-04-08T11:00:00Z",
      },
      {
        id: "m5",
        senderId: "omar-faruk",
        senderName: "Omar Faruk",
        text: "That sounds perfect. Thank you so much! Looking forward to your feedback.",
        timestamp: "2026-04-08T11:05:00Z",
      },
    ],
    createdAt: "2026-04-08T10:00:00Z",
  },
  {
    id: "conv-2",
    participants: {
      mentorUsername: "mitu-akter",
      studentUsername: "fatima-ali",
    },
    status: "pending",
    proposalTitle: "Fulbright Scholarship Essay Review",
    proposalDescription:
      "Review and feedback on Fulbright Program scholarship essays including the Statement of Grant Purpose and Personal Statement.",
    proposalPrice: 100,
    messages: [
      {
        id: "m6",
        senderId: "fatima-ali",
        senderName: "Fatima Ali",
        text: "Hello Mitu! I've been following your blog posts on scholarship essays. I'm applying for Fulbright this cycle and would love your help with my essays.",
        timestamp: "2026-04-10T09:00:00Z",
      },
      {
        id: "m7",
        senderId: "mitu-akter",
        senderName: "Mitu Akter",
        text: "Hi Fatima! Thank you for reaching out. Fulbright is one of my specialties. I'd be happy to review your essays. What field are you applying for?",
        timestamp: "2026-04-10T09:30:00Z",
      },
      {
        id: "m8",
        senderId: "fatima-ali",
        senderName: "Fatima Ali",
        text: "I'm applying for the Master's in International Development at Columbia. I have a first draft ready for review.",
        timestamp: "2026-04-10T09:45:00Z",
      },
    ],
    createdAt: "2026-04-10T09:00:00Z",
  },
];

// ─── Helper Functions ────────────────────────────────────────────

export function getConversationById(id: string): Conversation | undefined {
  return MOCK_CONVERSATIONS.find((c) => c.id === id);
}

// The "current user" for simulating auth — default is the student "omar-faruk"
export const CURRENT_USER_USERNAME = "omar-faruk";
export const CURRENT_USER_ROLE: "mentor" | "student" = "student";
