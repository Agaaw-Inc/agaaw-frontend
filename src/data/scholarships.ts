import { Scholarship } from "./types";

export const SCHOLARSHIPS: Record<string, Scholarship> = {
    "daad-scholarship": {
        slug: "daad-scholarship",
        name: "DAAD Scholarship",
        provider: "German Academic Exchange Service (DAAD)",
        country: "Germany",
        level: "Masters / PhD",
        deadline: "Dec 15, 2025",
        description:
            "The DAAD Scholarship supports international students who want to pursue postgraduate studies at German universities.",
        benefits: [
            "Monthly stipend",
            "Health insurance",
            "Travel allowance",
            "Tuition fee coverage (where applicable)",
        ],
        eligibility: [
            "Completed undergraduate degree",
            "Good academic record",
            "Work or research experience preferred",
            "English or German language proficiency",
        ],
        applicationSteps: [
            "Choose your study program",
            "Prepare required documents",
            "Apply on the DAAD portal",
            "Wait for the selection results",
        ],
        officialLink: "https://www.daad.de/en/",
    },

    "erasmus-mundus": {
        slug: "erasmus-mundus",
        name: "Erasmus Mundus Joint Masters",
        provider: "European Union",
        country: "Multiple European Countries",
        level: "Masters",
        deadline: "Jan 05, 2026",
        description:
            "Erasmus Mundus offers fully funded joint master’s programs in multiple European universities.",
        benefits: [
            "Full tuition fee waiver",
            "Monthly living stipend",
            "Travel allowance",
            "Health insurance",
        ],
        eligibility: [
            "Bachelor’s degree or equivalent",
            "Meet program-specific requirements",
            "English proficiency",
        ],
        applicationSteps: [
            "Select an EMJMD program",
            "Check requirements",
            "Submit application",
            "Interview (if required)",
        ],
        officialLink:
            "https://www.eacea.ec.europa.eu/scholarships/emjmd_en",
    },
};