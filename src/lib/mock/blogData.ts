export type Blog = {
  id: number;
  author_id: number;
  author_name: string;
  author_role: "mentor" | "admin" | "student";
  title: string;
  content: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
};

export const MOCK_BLOGS: Blog[] = [
  {
    id: 1,
    author_id: 4,
    author_name: "Mitu Akter",
    author_role: "mentor",
    title: "How to Write a Winning Scholarship Essay",
    content: `A winning scholarship essay goes beyond listing achievements — it tells a story. Start with a compelling hook that draws the reader in immediately. Share a specific moment or experience that shaped who you are and why you're pursuing this scholarship.\n\nBe authentic. Committees read hundreds of essays and can tell when someone is being genuine versus writing what they think the committee wants to hear. Reflect on your unique background, challenges you've overcome, and how this scholarship will help you achieve your goals.\n\nAlways tailor each essay to the specific scholarship. Research the organization behind it and align your values with theirs. Proofread multiple times and have someone you trust review it before submission.`,
    tags: ["scholarship", "essay", "tips"],
    is_published: true,
    created_at: "2026-01-15",
  },
  {
    id: 2,
    author_id: 1,
    author_name: "Arif Rahman",
    author_role: "mentor",
    title: "Top 5 Countries for International Students in 2026",
    content: `Choosing the right country for your studies is one of the most important decisions you'll make. Here are the top 5 destinations for international students in 2026:\n\n1. **Canada** - Known for its welcoming immigration policies and world-class universities.\n2. **Germany** - Offers many tuition-free programs even for international students.\n3. **Australia** - Strong research programs and a high quality of life.\n4. **Netherlands** - Over 2,000 English-taught programs across dozens of universities.\n5. **Japan** - Growing in popularity with generous government scholarships through MEXT.\n\nConsider tuition costs, living expenses, language requirements, and post-study work rights when making your decision.`,
    tags: ["countries", "study abroad", "2026"],
    is_published: true,
    created_at: "2026-02-03",
  },
  {
    id: 3,
    author_id: 7,
    author_name: "Farhan Ahmed",
    author_role: "mentor",
    title: "Understanding Student Visa Requirements",
    content: `Navigating student visa requirements can be overwhelming, but breaking it down step-by-step makes it manageable.\n\nFirst, you need a confirmed university offer letter — this is almost always required as the primary document. Next, you'll need to show proof of financial sufficiency, which varies by country but typically means showing 6–12 months of living and tuition costs in your bank account.\n\nHealth insurance, a clean criminal background check, and a valid passport with sufficient validity are also standard requirements. Some countries like the UK and Australia require an English proficiency test (IELTS/TOEFL) as part of the visa application itself, not just for university admission.\n\nApply as early as possible — aim for at least 3 months before your course start date.`,
    tags: ["visa", "student visa", "documents"],
    is_published: false,
    created_at: "2026-02-20",
  },
  {
    id: 4,
    author_id: 0,
    author_name: "Admin",
    author_role: "admin",
    title: "Agaaw Platform Updates – Spring 2026",
    content: `We are excited to announce several updates to the Agaaw platform this spring:\n\n- **Mentor Blog Section**: Mentors can now publish educational blogs directly on the platform to help students.\n- **Improved Scholarship Filters**: You can now filter scholarships by deadline, country, and funding type.\n- **Enhanced Profile Pages**: Mentor profiles now show their published blogs and student reviews.\n\nWe are committed to making the scholarship application process as smooth and informed as possible. Stay tuned for more updates!`,
    tags: ["platform", "updates", "news"],
    is_published: true,
    created_at: "2026-03-10",
  },
  {
    id: 5,
    author_id: 4,
    author_name: "Mitu Akter",
    author_role: "mentor",
    title: "How to Approach a Mentor (Without Being Awkward)",
    content: `Reaching out to a mentor for the first time can feel intimidating. Here's how to do it effectively:\n\nBe specific about what you're asking. "I need help" is too vague. Instead, say "I'm applying for the Chevening Scholarship and need guidance on structuring my leadership essay."\n\nDo your research first. Read their profile and any resources they've shared. Show that you've already put in effort.\n\nKeep your initial message short — under 150 words. Mentors are busy. A concise, respectful message will get a faster reply than a long email.\n\nBe patient and professional. A follow-up after one week is acceptable if you haven't heard back.`,
    tags: ["mentorship", "communication", "tips"],
    is_published: true,
    created_at: "2026-03-22",
  },
];
