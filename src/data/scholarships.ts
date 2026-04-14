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
            "The DAAD Scholarship supports international students from developing countries who want to pursue postgraduate or doctoral studies at German universities. It aims to train well-qualified professionals for sustainable development.",
        benefits: [
            "Monthly stipend of 934 euros for Master's and 1,300 euros for doctoral candidates",
            "Payments towards health, accident and personal liability insurance cover",
            "Travel allowance, unless covered by the home country or another source",
            "Study and research allowance",
        ],
        eligibility: [
            "Completed Bachelor's degree (usually a four-year course) in an appropriate subject",
            "At least two years of professional experience",
            "Academic degrees should normally not be more than six years old",
            "English (IELTS/TOEFL) or German language proficiency depending on the chosen program",
        ],
        applicationSteps: [
            "Identify eligible postgraduate courses on the DAAD database",
            "Submit applications directly to the respective university (not DAAD)",
            "Wait for the university selection committee evaluation",
            "Selected candidates will be recommended to DAAD for final approval",
        ],
        officialLink: "https://www2.daad.de/deutschland/stipendium/datenbank/en/21148-scholarship-database/?status=&origin=&subjectGrps=&daad=&q=epos&page=1&detail=50076777",
    },

    "erasmus-mundus": {
        slug: "erasmus-mundus",
        name: "Erasmus Mundus Joint Masters",
        provider: "European Union",
        country: "Multiple European Countries",
        level: "Masters",
        deadline: "Jan 05, 2026",
        description:
            "Erasmus Mundus Joint Masters (EMJM) are prestigious, fully funded, integrated study programmes delivered by international consortiums of higher education institutions across Europe and the world.",
        benefits: [
            "Full tuition fee waiver and academic costs covered",
            "Monthly living allowance of up to 1,400 EUR for the duration of the programme",
            "Travel and installation contribution",
            "Comprehensive health and accident insurance",
        ],
        eligibility: [
            "Bachelor’s degree or equivalent prior to the start of the master’s programme",
            "Outstanding academic record",
            "Proof of English language proficiency (typically IELTS/TOEFL)",
            "Students worldwide are eligible, but cannot have previously received an EMJM scholarship",
        ],
        applicationSteps: [
            "Consult the online Erasmus Mundus catalogue",
            "Select up to three preferred programs",
            "Apply directly through the specific master's program consortium website",
            "Submit necessary documents (CV, transcripts, motivation letters, recommendations)",
        ],
        officialLink: "https://www.eacea.ec.europa.eu/scholarships/emjmd_en",
    },

    "fulbright-scholarship": {
        slug: "fulbright-scholarship",
        name: "Fulbright Foreign Student Program",
        provider: "U.S. Government",
        country: "United States",
        level: "Masters / PhD",
        deadline: "Oct 01, 2025",
        description:
            "The Fulbright Foreign Student Program enables graduate students, young professionals, and artists from abroad to study and conduct research in the United States at U.S. universities or other academic institutions.",
        benefits: [
            "J-1 visa sponsorship",
            "Full tuition and mandatory fees coverage",
            "Monthly living stipend to cover room, board, and incidental expenses",
            "Sickness and accident health benefits",
            "Round-trip international airfare",
        ],
        eligibility: [
            "Citizenship of a participating country (restrictions apply for dual U.S. citizens)",
            "Equivalent of a U.S. bachelor's degree with a distinguished academic record",
            "High proficiency in English (TOEFL or IELTS scores required)",
            "Commitment to return to the home country after completing the program",
        ],
        applicationSteps: [
            "Find your country on the official Fulbright website for specific guidelines",
            "Consult with your local U.S. Embassy or Fulbright Commission",
            "Complete the online application and gather required documents",
            "Attend an interview if selected by the binational committee",
        ],
        officialLink: "https://foreign.fulbrightonline.org/",
    },

    "murdoch-university": {
        slug: "murdoch-university",
        name: "International Futures Scholarship",
        provider: "Murdoch University",
        country: "Australia",
        level: "Bachelors / Masters",
        deadline: "Mar 08, 2026",
        description:
            "Murdoch University offers the International Futures Scholarship and International Welcome Scholarship, aimed at providing financial support via significant tuition fee reductions to eligible international students commencing their studies in Western Australia.",
        benefits: [
            "20% to 25% reduction in tuition fees over the full duration of the degree",
            "Access to Murdoch University's world-class facilities and student support",
            "Applicable directly to tuition fee costs (no cash payments)",
        ],
        eligibility: [
            "Be a new international full-fee paying student",
            "Starting an eligible coursework Bachelor or Master degree at a Western Australia campus",
            "Not be receiving any other Murdoch scholarship",
            "Meet academic and English language entry requirements for the chosen course",
        ],
        applicationSteps: [
            "Apply directly for an eligible coursework degree at Murdoch University",
            "There is no separate scholarship application required",
            "The scholarship is automatically assessed and applied upon receiving a course offer",
            "Accept your offer and enroll at the university",
        ],
        officialLink: "https://www.murdoch.edu.au/study/international-students/scholarships",
    },

    "mext": {
        slug: "mext",
        name: "MEXT Scholarship",
        provider: "Japanese Government (MEXT)",
        country: "Japan",
        level: "Undergraduate / Masters / PhD",
        deadline: "Apr 15, 2026",
        description:
            "The Ministry of Education, Culture, Sports, Science and Technology (MEXT) funds this highly competitive scholarship program to enable outstanding international students to study at Japanese universities.",
        benefits: [
            "Full tuition fee waiver (entrance exam, matriculation, and tuition)",
            "Monthly stipend of approximately 117,000 to 145,000 JPY depending on the level of study and region",
            "Round-trip economy-class airticket from the home country to Japan",
            "Six months of preparatory Japanese language education (if applicable)",
        ],
        eligibility: [
            "Nationality of a country that has diplomatic relations with Japan",
            "Strict age criteria (e.g., under 35 years old for research students, under 25 for undergraduates)",
            "Required academic background (e.g., 12 years of schooling for undergrads, bachelor’s for research)",
            "Willingness to learn Japanese and adapt to life in Japan",
        ],
        applicationSteps: [
            "Contact the Japanese Embassy or Consulate in your home country (Embassy Recommendation)",
            "Alternatively, apply directly to an accepting Japanese university (University Recommendation)",
            "Submit extensive documentation including transcripts, study plan, and medical certificate",
            "Pass the rigorous written examinations and interviews",
        ],
        officialLink: "https://www.studyinjapan.go.jp/en/planning/scholarship/mext/",
    },
};