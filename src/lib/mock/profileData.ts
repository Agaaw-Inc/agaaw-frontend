import type {
  MentorProfile,
  StudentProfile,
  UserProfile,
  Conversation,
} from "@/data/profileTypes";
import { MOCK_BLOGS } from "./blogData";

// ─── Mentor Profiles ─────────────────────────────────────────────

export const MOCK_MENTORS: MentorProfile[] = [
  {
    role: "mentor",
    username: "arif-rahman",
    name: "Arif Rahman",
    image: "https://i.pravatar.cc/300?u=arif",
    university: "University of Oxford",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    bio: "Scholarship consultant and study abroad expert with 8+ years of experience helping students achieve their academic dreams. I've personally guided over 200 students through successful applications to top universities in the UK, US, and Europe. My approach combines strategic planning with personalized mentorship to ensure each student maximizes their potential.",
    expertise: [
      "Scholarship Essays",
      "UK Universities",
      "Personal Statements",
      "IELTS Preparation",
      "Visa Applications",
      "Interview Coaching",
    ],
    services: [
      {
        id: "s1",
        title: "Full Application Review",
        description:
          "Complete review of your university application including personal statement, CV, and supporting documents with detailed feedback.",
        price: 120,
        currency: "USD",
        duration: "90 min",
      },
      {
        id: "s2",
        title: "Scholarship Strategy Session",
        description:
          "Personalized session to identify the best scholarship opportunities for your profile and build a winning application strategy.",
        price: 80,
        currency: "USD",
        duration: "60 min",
      },
      {
        id: "s3",
        title: "Mock Interview Prep",
        description:
          "Practice scholarship or university interview with real-time feedback and coaching on body language, answers, and confidence.",
        price: 60,
        currency: "USD",
        duration: "45 min",
      },
      {
        id: "s4",
        title: "CV & Resume Review",
        description:
          "Professional review and restructuring of your academic CV to meet international university standards.",
        price: 40,
        currency: "USD",
        duration: "30 min",
      },
    ],
    reviews: [
      {
        id: "r1",
        authorName: "Sarah Johnson",
        authorImage: "https://i.pravatar.cc/80?u=sarah",
        rating: 5,
        text: "Arif helped me secure a full scholarship to Oxford. His guidance on the personal statement was invaluable. I couldn't have done it without him!",
        date: "2026-03-15",
      },
      {
        id: "r2",
        authorName: "James Lee",
        authorImage: "https://i.pravatar.cc/80?u=james",
        rating: 5,
        text: "Extremely knowledgeable about UK universities. The mock interview session was incredibly helpful. Arif pointed out areas I never would have thought to improve.",
        date: "2026-02-28",
      },
      {
        id: "r3",
        authorName: "Maria Gonzalez",
        authorImage: "https://i.pravatar.cc/80?u=maria",
        rating: 4,
        text: "Great mentor! Very responsive and always available to answer questions. His scholarship strategy session gave me a clear roadmap.",
        date: "2026-02-10",
      },
      {
        id: "r4",
        authorName: "Ahmed Hassan",
        authorImage: "https://i.pravatar.cc/80?u=ahmed",
        rating: 5,
        text: "I applied to 5 scholarships and got accepted to 3 after working with Arif. His essay review service is worth every penny.",
        date: "2026-01-20",
      },
      {
        id: "r5",
        authorName: "Emily Chen",
        authorImage: "https://i.pravatar.cc/80?u=emily",
        rating: 5,
        text: "Arif's knowledge of the UK visa process saved me so much time and stress. Highly recommend for anyone applying to UK universities.",
        date: "2026-01-05",
      },
    ],
    blogIds: [2],
    education: [
      {
        degree: "Master's",
        field: "International Education",
        institution: "University of Oxford",
        year: "2019",
      },
      {
        degree: "Bachelor's",
        field: "English Literature",
        institution: "University of Dhaka",
        year: "2016",
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
    stats: {
      studentsHelped: 47,
      rating: 4.9,
      totalReviews: 38,
      sessions: 128,
      responseRate: 95,
    },
    experience_years: 8,
    hourly_rate: 60,
    portfolio_link: "https://arifrahman.com",
    languages: ["English", "Bengali", "Arabic"],
    is_available: true,
    availability: "Available",
    isVerified: true,
    joinedDate: "2024-06-15",
  },
  {
    role: "mentor",
    username: "mitu-akter",
    name: "Mitu Akter",
    image: "https://i.pravatar.cc/300?u=mitu",
    university: "Harvard University",
    country: "United States",
    countryFlag: "🇺🇸",
    bio: "Harvard alumna passionate about helping international students navigate the US university application process. Specializing in essay writing, financial aid applications, and career counseling for aspiring scholars.",
    expertise: [
      "Essay Writing",
      "US Universities",
      "Financial Aid",
      "Career Counseling",
      "Chevening Scholarship",
      "Research Proposals",
    ],
    services: [
      {
        id: "s5",
        title: "Essay Masterclass",
        description:
          "One-on-one session to craft a compelling scholarship or admission essay that stands out from the competition.",
        price: 100,
        currency: "USD",
        duration: "60 min",
      },
      {
        id: "s6",
        title: "University Shortlisting",
        description:
          "Data-driven analysis to build your optimal university shortlist based on your profile, budget, and goals.",
        price: 70,
        currency: "USD",
        duration: "45 min",
      },
      {
        id: "s7",
        title: "Financial Aid Package Review",
        description:
          "Review your financial aid options and help you craft strong need-based and merit-based scholarship applications.",
        price: 90,
        currency: "USD",
        duration: "60 min",
      },
    ],
    reviews: [
      {
        id: "r6",
        authorName: "David Park",
        authorImage: "https://i.pravatar.cc/80?u=david",
        rating: 5,
        text: "Mitu's essay feedback transformed my personal statement completely. Got accepted to 4 out of 5 universities I applied to!",
        date: "2026-03-01",
      },
      {
        id: "r7",
        authorName: "Fatima Ali",
        authorImage: "https://i.pravatar.cc/80?u=fatima",
        rating: 4,
        text: "Very helpful with financial aid applications. She knows the US system inside and out.",
        date: "2026-02-15",
      },
      {
        id: "r8",
        authorName: "Tom Wilson",
        authorImage: "https://i.pravatar.cc/80?u=tom",
        rating: 5,
        text: "Best investment I made for my study abroad journey. Mitu's guidance was practical and actionable.",
        date: "2026-01-22",
      },
    ],
    blogIds: [1, 5],
    education: [
      {
        degree: "Master's",
        field: "Public Policy",
        institution: "Harvard University",
        year: "2020",
      },
      {
        degree: "Bachelor's",
        field: "Political Science",
        institution: "University of Dhaka",
        year: "2017",
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Website", url: "#" },
    ],
    stats: {
      studentsHelped: 63,
      rating: 4.8,
      totalReviews: 42,
      sessions: 195,
      responseRate: 92,
    },
    experience_years: 6,
    hourly_rate: 75,
    portfolio_link: "https://mituakter.io",
    languages: ["English", "Bengali", "Hindi"],
    is_available: true,
    availability: "Available",
    isVerified: true,
    joinedDate: "2024-03-20",
  },
  {
    role: "mentor",
    username: "farhan-ahmed",
    name: "Farhan Ahmed",
    image: "https://i.pravatar.cc/300?u=farhan",
    university: "University of Melbourne",
    country: "Australia",
    countryFlag: "🇦🇺",
    bio: "Study abroad consultant specializing in Australian universities and visa processes. With firsthand experience as an international student and now permanent resident, I help students navigate every step from application to settlement.",
    expertise: [
      "Australian Universities",
      "Student Visa",
      "IELTS Strategy",
      "Post-Study Work Rights",
      "SOP Writing",
      "Research Applications",
    ],
    services: [
      {
        id: "s8",
        title: "Visa Application Support",
        description:
          "Step-by-step guidance through the Australian student visa (Subclass 500) application process.",
        price: 85,
        currency: "USD",
        duration: "60 min",
      },
      {
        id: "s9",
        title: "SOP Review & Editing",
        description:
          "Professional review and editing of your Statement of Purpose to ensure clarity, impact, and university fit.",
        price: 55,
        currency: "USD",
        duration: "45 min",
      },
    ],
    reviews: [
      {
        id: "r9",
        authorName: "Lisa Wang",
        authorImage: "https://i.pravatar.cc/80?u=lisa",
        rating: 5,
        text: "Farhan's visa guidance was spot on. My application was approved in just 2 weeks!",
        date: "2026-02-20",
      },
      {
        id: "r10",
        authorName: "Rakib Hossain",
        authorImage: "https://i.pravatar.cc/80?u=rakib",
        rating: 4,
        text: "Very supportive throughout the application process. Would recommend for anyone applying to Australian universities.",
        date: "2026-01-30",
      },
    ],
    blogIds: [3],
    education: [
      {
        degree: "Master's",
        field: "Computer Science",
        institution: "University of Melbourne",
        year: "2021",
      },
      {
        degree: "Bachelor's",
        field: "Information Technology",
        institution: "BUET",
        year: "2018",
      },
    ],
    socialLinks: [{ platform: "LinkedIn", url: "#" }],
    stats: {
      studentsHelped: 31,
      rating: 4.7,
      totalReviews: 24,
      sessions: 89,
      responseRate: 88,
    },
    experience_years: 5,
    hourly_rate: 50,
    portfolio_link: "https://farhanconsulting.au",
    languages: ["English", "Bengali"],
    is_available: false,
    availability: "Busy",
    isVerified: true,
    joinedDate: "2024-09-10",
  },
  {
    role: "mentor",
    username: "nadia-islam",
    name: "Nadia Islam",
    image: "https://i.pravatar.cc/300?u=nadia",
    university: "TU Munich",
    country: "Germany",
    countryFlag: "🇩🇪",
    bio: "Former DAAD scholar and current PhD researcher at TU Munich. I help students apply to German universities, navigate tuition-free programs, and master blocked account requirements. Fluent in German and Bengali.",
    expertise: [
      "German Universities",
      "DAAD Scholarship",
      "Blocked Account",
      "German Language",
      "Research Proposals",
      "PhD Applications",
    ],
    services: [
      {
        id: "s10",
        title: "German University Strategy",
        description:
          "Comprehensive planning session for applying to German universities including program selection, Uni-Assist, and deadlines.",
        price: 75,
        currency: "USD",
        duration: "60 min",
      },
      {
        id: "s11",
        title: "DAAD Scholarship Application",
        description:
          "End-to-end guidance for the DAAD scholarship application including motivation letter and research proposal.",
        price: 95,
        currency: "USD",
        duration: "75 min",
      },
    ],
    reviews: [
      {
        id: "r11",
        authorName: "Karim Uddin",
        authorImage: "https://i.pravatar.cc/80?u=karim",
        rating: 5,
        text: "Nadia's first-hand DAAD experience was invaluable. She reviewed my motivation letter three times until it was perfect!",
        date: "2026-03-10",
      },
    ],
    blogIds: [],
    education: [
      {
        degree: "PhD (ongoing)",
        field: "Mechanical Engineering",
        institution: "TU Munich",
        year: "2026",
      },
      {
        degree: "Master's",
        field: "Mechanical Engineering",
        institution: "TU Munich",
        year: "2022",
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Twitter", url: "#" },
    ],
    stats: {
      studentsHelped: 22,
      rating: 4.9,
      totalReviews: 15,
      sessions: 58,
      responseRate: 97,
    },
    experience_years: 4,
    hourly_rate: 55,
    portfolio_link: "",
    languages: ["English", "Bengali", "German"],
    is_available: true,
    availability: "Available",
    isVerified: true,
    joinedDate: "2025-01-05",
  },
  {
    role: "mentor",
    username: "tanvir-hasan",
    name: "Tanvir Hasan",
    image: "https://i.pravatar.cc/300?u=tanvir",
    university: "University of Tokyo",
    country: "Japan",
    countryFlag: "🇯🇵",
    bio: "MEXT scholar and University of Tokyo graduate. Helping students access Japanese government scholarships and navigate the unique Japanese university system. Passionate about bridging education gaps for South Asian students.",
    expertise: [
      "MEXT Scholarship",
      "Japanese Universities",
      "Research Plans",
      "Japanese Language",
      "Embassy Recommendation",
    ],
    services: [
      {
        id: "s12",
        title: "MEXT Application Bootcamp",
        description:
          "Intensive session covering MEXT scholarship timeline, research plan writing, and professor outreach strategies.",
        price: 70,
        currency: "USD",
        duration: "60 min",
      },
    ],
    reviews: [
      {
        id: "r12",
        authorName: "Riya Das",
        authorImage: "https://i.pravatar.cc/80?u=riya",
        rating: 5,
        text: "Tanvir helped me write a research plan that got accepted by two professors at UTokyo. Life-changing mentorship!",
        date: "2026-02-08",
      },
      {
        id: "r13",
        authorName: "Imran Khan",
        authorImage: "https://i.pravatar.cc/80?u=imran",
        rating: 5,
        text: "His MEXT guidance is the best I've seen. Organized, detailed, and incredibly supportive.",
        date: "2026-01-15",
      },
    ],
    blogIds: [],
    education: [
      {
        degree: "Master's",
        field: "Information Science",
        institution: "University of Tokyo",
        year: "2023",
      },
      {
        degree: "Bachelor's",
        field: "Computer Science",
        institution: "CUET",
        year: "2020",
      },
    ],
    socialLinks: [{ platform: "LinkedIn", url: "#" }],
    stats: {
      studentsHelped: 18,
      rating: 4.9,
      totalReviews: 12,
      sessions: 42,
      responseRate: 100,
    },
    experience_years: 3,
    hourly_rate: 45,
    portfolio_link: "https://tanvir-mext.jp",
    languages: ["English", "Bengali", "Japanese"],
    is_available: true,
    availability: "Available",
    isVerified: true,
    joinedDate: "2025-04-01",
  },
  {
    role: "mentor",
    username: "sadia-khanam",
    name: "Sadia Khanam",
    image: "https://i.pravatar.cc/300?u=sadia",
    university: "University of Amsterdam",
    country: "Netherlands",
    countryFlag: "🇳🇱",
    bio: "Holland Scholar and UvA alumna specializing in European university applications. I focus on helping students find affordable, high-quality English-taught programs in the Netherlands, Scandinavia, and across Europe.",
    expertise: [
      "European Universities",
      "Holland Scholarship",
      "Erasmus Mundus",
      "English-Taught Programs",
      "Motivation Letters",
    ],
    services: [
      {
        id: "s13",
        title: "Europe Study Planning",
        description:
          "Build a strategic plan for studying in Europe — program selection, funding sources, and application timelines.",
        price: 65,
        currency: "USD",
        duration: "50 min",
      },
      {
        id: "s14",
        title: "Motivation Letter Workshop",
        description:
          "Craft a powerful motivation letter tailored to European university standards with iterative feedback.",
        price: 50,
        currency: "USD",
        duration: "40 min",
      },
    ],
    reviews: [
      {
        id: "r14",
        authorName: "Priya Shah",
        authorImage: "https://i.pravatar.cc/80?u=priya",
        rating: 5,
        text: "Sadia's knowledge of European scholarships is unmatched. She found opportunities I didn't even know existed!",
        date: "2026-03-05",
      },
      {
        id: "r15",
        authorName: "John Smith",
        authorImage: "https://i.pravatar.cc/80?u=johnsmith",
        rating: 4,
        text: "Very helpful session. Got clear next steps for my Erasmus Mundus application.",
        date: "2026-02-12",
      },
    ],
    blogIds: [],
    education: [
      {
        degree: "Master's",
        field: "Data Science",
        institution: "University of Amsterdam",
        year: "2022",
      },
      {
        degree: "Bachelor's",
        field: "Statistics",
        institution: "University of Dhaka",
        year: "2019",
      },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "Website", url: "#" },
    ],
    stats: {
      studentsHelped: 35,
      rating: 4.8,
      totalReviews: 28,
      sessions: 102,
      responseRate: 91,
    },
    experience_years: 4,
    hourly_rate: 40,
    portfolio_link: "https://sadiakhanam.nl",
    languages: ["English", "Bengali", "Dutch"],
    is_available: false,
    availability: "Away",
    isVerified: true,
    joinedDate: "2024-11-20",
  },
];

// ─── Student Profiles ────────────────────────────────────────────

export const MOCK_STUDENTS: StudentProfile[] = [
  {
    role: "student",
    username: "omar-faruk",
    name: "Omar Faruk",
    image: "https://i.pravatar.cc/300?u=omar",
    university: "University of Dhaka",
    country: "Bangladesh",
    countryFlag: "🇧🇩",
    bio: "Final year Computer Science student passionate about AI and machine learning. Looking for fully-funded PhD opportunities in the UK or Canada. Active open-source contributor and research enthusiast.",
    education: [
      {
        degree: "Bachelor's (ongoing)",
        field: "Computer Science & Engineering",
        institution: "University of Dhaka",
        year: "2026",
      },
    ],
    testScores: [
      { name: "IELTS", score: "7.5" },
      { name: "GRE", score: "325" },
    ],
    goals: {
      targetCountries: ["United Kingdom", "Canada", "Germany"],
      targetDegree: "PhD",
      scholarshipInterests: [
        "Commonwealth Scholarship",
        "Vanier CGS",
        "DAAD",
      ],
      timeline: "Fall 2027",
    },
    interests: [
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision",
      "Open Source",
    ],
    stats: {
      applicationsSubmitted: 5,
      mentorsConnected: 3,
      scholarshipsTracked: 12,
    },
    joinedDate: "2025-08-10",
  },
  {
    role: "student",
    username: "fatima-ali",
    name: "Fatima Ali",
    image: "https://i.pravatar.cc/300?u=fatima-s",
    university: "BRAC University",
    country: "Bangladesh",
    countryFlag: "🇧🇩",
    bio: "Business Administration student with a keen interest in international development. Seeking Masters opportunities in the US or Netherlands with scholarship support.",
    education: [
      {
        degree: "Bachelor's",
        field: "Business Administration",
        institution: "BRAC University",
        year: "2025",
      },
    ],
    testScores: [
      { name: "IELTS", score: "7.0" },
      { name: "GMAT", score: "680" },
    ],
    goals: {
      targetCountries: ["United States", "Netherlands"],
      targetDegree: "Master's",
      scholarshipInterests: [
        "Fulbright",
        "Holland Scholarship",
        "Orange Knowledge Programme",
      ],
      timeline: "Fall 2026",
    },
    interests: [
      "International Development",
      "Social Entrepreneurship",
      "Sustainable Business",
    ],
    stats: {
      applicationsSubmitted: 8,
      mentorsConnected: 4,
      scholarshipsTracked: 15,
    },
    joinedDate: "2025-06-01",
  },
  {
    role: "student",
    username: "rakib-hossain",
    name: "Rakib Hossain",
    image: "https://i.pravatar.cc/300?u=rakib-s",
    university: "BUET",
    country: "Bangladesh",
    countryFlag: "🇧🇩",
    bio: "Mechanical Engineering graduate aiming for a research-based Masters in Germany. Interested in renewable energy and automotive engineering.",
    education: [
      {
        degree: "Bachelor's",
        field: "Mechanical Engineering",
        institution: "BUET",
        year: "2025",
      },
    ],
    testScores: [
      { name: "IELTS", score: "6.5" },
      { name: "GRE", score: "315" },
    ],
    goals: {
      targetCountries: ["Germany", "Japan"],
      targetDegree: "Master's",
      scholarshipInterests: ["DAAD", "MEXT", "Erasmus Mundus"],
      timeline: "Winter 2026",
    },
    interests: [
      "Renewable Energy",
      "Automotive Engineering",
      "Fluid Dynamics",
    ],
    stats: {
      applicationsSubmitted: 3,
      mentorsConnected: 2,
      scholarshipsTracked: 8,
    },
    joinedDate: "2025-09-15",
  },
  {
    role: "student",
    username: "priya-das",
    name: "Priya Das",
    image: "https://i.pravatar.cc/300?u=priya-s",
    university: "Jagannath University",
    country: "Bangladesh",
    countryFlag: "🇧🇩",
    bio: "English Literature graduate exploring Masters programs in the UK and Australia. Interested in postcolonial studies and creative writing. Looking for teaching assistantship opportunities.",
    education: [
      {
        degree: "Bachelor's",
        field: "English Literature",
        institution: "Jagannath University",
        year: "2025",
      },
    ],
    testScores: [{ name: "IELTS", score: "8.0" }],
    goals: {
      targetCountries: ["United Kingdom", "Australia"],
      targetDegree: "Master's",
      scholarshipInterests: [
        "Chevening",
        "Commonwealth Scholarship",
        "Australia Awards",
      ],
      timeline: "Fall 2026",
    },
    interests: [
      "Postcolonial Studies",
      "Creative Writing",
      "Literary Criticism",
    ],
    stats: {
      applicationsSubmitted: 6,
      mentorsConnected: 3,
      scholarshipsTracked: 10,
    },
    joinedDate: "2025-07-20",
  },
];

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

export function getMentorByUsername(
  username: string
): MentorProfile | undefined {
  return MOCK_MENTORS.find((m) => m.username === username);
}

export function getStudentByUsername(
  username: string
): StudentProfile | undefined {
  return MOCK_STUDENTS.find((s) => s.username === username);
}

export function getProfileByUsername(
  username: string
): UserProfile | undefined {
  return getMentorByUsername(username) || getStudentByUsername(username);
}

export function getConversationById(id: string): Conversation | undefined {
  return MOCK_CONVERSATIONS.find((c) => c.id === id);
}

export function getMentorBlogs(blogIds: number[]) {
  return MOCK_BLOGS.filter((b) => blogIds.includes(b.id) && b.is_published);
}

// The "current user" for simulating auth — default is the student "omar-faruk"
export const CURRENT_USER_USERNAME = "omar-faruk";
export const CURRENT_USER_ROLE: "mentor" | "student" = "student";
