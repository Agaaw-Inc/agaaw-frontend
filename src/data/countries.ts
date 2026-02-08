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
};