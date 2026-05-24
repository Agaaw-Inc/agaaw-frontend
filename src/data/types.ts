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
    image: string;
    funding: string;
    amount: string;
}

export interface Country {
    slug: string;
    name: string;
    region?: string;
    shortIntro: string;
    opportunities: string[];
    universities: string[];
    howToApply: string[];
    whenToApply: string;
    visaPolicy: string;
    avgCost: string;
    tuitionCost?: string;
    language?: string;
    currency?: string;
    jobOpportunities: string[];
    image: string;
    cons?: string[];
    scholarshipsOverview?: string;
    workRights?: string;
}
