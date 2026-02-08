export interface Scholarship {
    slug: string;
    name: string;
    provider: string;
    country: string;
    level: string;
    deadline: string;
    description: string;
    benefits: string[];
    eligibility: string[];
    applicationSteps: string[];
    officialLink: string;
}

export interface Country {
    slug: string;
    name: string;
    shortIntro: string;
    opportunities: string[];
    universities: string[];
    howToApply: string[];
    whenToApply: string;
    visaPolicy: string;
    avgCost: string;
    jobOpportunities: string[];
}