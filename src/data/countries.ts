import { Country } from "./types";

export const COUNTRIES: Record<string, Country> = {
    canada: {
        slug: "canada",
        name: "Canada",
        shortIntro:
            "Canada is a top destination for international students with high-quality education and post-study work opportunities.",
        opportunities: [
            "Post-graduation work permit (PGWP)",
            "Pathway to permanent residency",
            "Co-op internship opportunities",
        ],
        universities: [
            "University of Toronto",
            "McGill University",
            "UBC",
        ],
        howToApply: [
            "Choose program & university",
            "Apply online",
            "Receive offer letter",
            "Apply for study permit",
        ],
        whenToApply:
            "Fall, Winter, Summer intakes. Apply 8–12 months earlier.",
        visaPolicy:
            "Canadian Study Permit required. Proof of funds & admission letter needed.",
        avgCost: "Tuition: CAD 15k–30k. Living: CAD 10k–15k/year.",
        jobOpportunities: [
            "Part-time 20 hrs/week",
            "Co-op programs",
            "PGWP after graduation",
        ],
    },
    "united-kingdom": {
        slug: "united-kingdom",
        name: "United Kingdom",
        shortIntro:
            "The UK offers world-class education with shorter course durations and a rich academic heritage.",
        opportunities: [
            "2-year Graduate Route visa",
            "High concentration of top-ranked universities",
            "Shorter Master's programs (1 year)",
        ],
        universities: [
            "University of Oxford",
            "University of Cambridge",
            "Imperial College London",
        ],
        howToApply: [
            "Apply via UCAS (Undergrad) or directly (Postgrad)",
            "Submit Personal Statement & References",
            "Receive CAS (Confirmation of Acceptance)",
            "Apply for Student Visa",
        ],
        whenToApply:
            "Main intake in September/October. Some January starts. Apply by January/June deadlines.",
        visaPolicy:
            "Student Visa (formerly Tier 4). Requires 70 points under the points-based system.",
        avgCost: "Tuition: £12k–£25k. Living: £12k–£15k/year.",
        jobOpportunities: [
            "Work 20 hrs/week during term",
            "Full-time during vacations",
            "2-year post-study work visa",
        ],
    },
    germany: {
        slug: "germany",
        name: "Germany",
        shortIntro:
            "Germany is known for its tuition-free public universities and its powerhouse economy in engineering and tech.",
        opportunities: [
            "No tuition fees at public universities",
            "Strong focus on research and development",
            "Excellent travel opportunities within the EU",
        ],
        universities: [
            "Technical University of Munich",
            "Ludwig Maximilian University",
            "Heidelberg University",
        ],
        howToApply: [
            "Check recognition of your diploma (Anabin)",
            "Apply via Uni-Assist or directly",
            "Open a Blocked Bank Account",
            "Apply for German National Visa",
        ],
        whenToApply:
            "Winter semester (Oct) and Summer semester (April). Deadlines: July 15 and Jan 15.",
        visaPolicy:
            "National Visa for Studies. Requires proof of €11,208 in a blocked account.",
        avgCost: "Tuition: €0 (Public) to €20k (Private). Living: €11k/year.",
        jobOpportunities: [
            "120 full days or 240 half days per year",
            "Student assistant (HiWi) roles",
            "18-month job seeker visa after graduation",
        ],
    },
    australia: {
        slug: "australia",
        name: "Australia",
        shortIntro:
            "Australia offers a laid-back lifestyle combined with highly prestigious universities and excellent weather.",
        opportunities: [
            "Extended post-study work rights",
            "Diverse cultural environment",
            "High minimum wage for student jobs",
        ],
        universities: [
            "University of Melbourne",
            "Australian National University",
            "University of Sydney",
        ],
        howToApply: [
            "Apply to university directly or through an agent",
            "Receive Electronic Confirmation of Enrolment (eCoE)",
            "Undergo health checkup",
            "Apply for Subclass 500 Visa",
        ],
        whenToApply:
            "Semester 1 (Feb) and Semester 2 (July). Apply 4–6 months in advance.",
        visaPolicy:
            "Student Visa (Subclass 500). Requires OSHC (Health Insurance) and GTE requirement.",
        avgCost: "Tuition: AUD 25k–45k. Living: AUD 21k–25k/year.",
        jobOpportunities: [
            "Work 48 hours per fortnight",
            "Professional Year Programs",
            "Regional work incentives for longer visas",
        ],
    },
};