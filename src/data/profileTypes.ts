// ─── Profile System Types ─────────────────────────────────────────
// Shared types for the unified profile system with three view modes:
// Public (/profile/:username), Own (/my-profile), Conversation (/conversation/:id)

export type UserRole = "mentor" | "student";
export type ProfileViewMode = "public" | "own" | "conversation";

// ─── Service & Review ─────────────────────────────────────────────

export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  duration: string; // e.g. "60 min", "Per session"
}

export interface Review {
  id: string;
  authorName: string;
  authorImage: string;
  rating: number; // 1-5
  text: string;
  date: string;
}

// ─── Education & Academic ─────────────────────────────────────────

export interface Education {
  degree: string;
  field: string;
  institution: string;
  year: string;
}

export interface TestScore {
  name: string; // e.g. "IELTS", "GRE", "TOEFL"
  score: string;
}

// ─── Mentor Profile ──────────────────────────────────────────────

export interface MentorProfile {
  role: "mentor";
  username: string;
  name: string;
  image: string;
  university: string;
  country: string;
  countryFlag: string;
  bio: string;
  expertise: string[];
  services: Service[];
  reviews: Review[];
  blogIds: number[];
  education: Education[];
  socialLinks: { platform: string; url: string }[];
  stats: {
    studentsHelped: number;
    rating: number;
    totalReviews: number;
    sessions: number;
    responseRate: number;
  };
  // ─── Mentor DB table fields ──────────────────────
  experience_years: number;
  hourly_rate: number;
  portfolio_link: string;
  languages: string[];
  is_available: boolean;
  department?: string;
  universityIdCard?: string;
  address?: string;
  eduMail?: string;
  phoneNumber?: string;
  // ─────────────────────────────────────────────────
  availability: string; // display label: "Available", "Busy", "Away"
  isVerified: boolean;
  joinedDate: string;
}

// ─── Student Profile ─────────────────────────────────────────────

export interface StudentProfile {
  role: "student";
  username: string;
  name: string;
  image: string;
  university: string;
  country: string;
  countryFlag: string;
  bio: string;
  education: Education[];
  testScores: TestScore[];
  goals: {
    targetCountries: string[];
    targetDegree: string;
    scholarshipInterests: string[];
    timeline: string;
  };
  interests: string[];
  stats: {
    applicationsSubmitted: number;
    mentorsConnected: number;
    scholarshipsTracked: number;
  };
  joinedDate: string;
}

// ─── Discriminated Union ─────────────────────────────────────────

export type UserProfile = MentorProfile | StudentProfile;

// ─── Profile Context ─────────────────────────────────────────────

export interface ProfileContext {
  viewMode: ProfileViewMode;
  isOwner: boolean;
  role: UserRole;
  conversationId?: string;
}

// ─── Conversation ────────────────────────────────────────────────

export interface ConversationMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  participants: {
    mentorUsername: string;
    studentUsername: string;
  };
  status: "pending" | "accepted" | "in-progress" | "completed" | "rejected";
  proposalTitle?: string;
  proposalDescription?: string;
  proposalPrice?: number;
  messages: ConversationMessage[];
  createdAt: string;
}
