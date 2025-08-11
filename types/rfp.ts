export interface IRFP {
    id: string;
    title: string;
    description: string;
    company: string;
    location?: string;
    requirements?: string;
    budget_range: string;
    deadline: string;
    status: string;
    category: string;
    priority: string;
    contact_email?: string;
    contact_phone?: string;
    additional_information?: string;
    attachments?: string[];
    tags?: string[];
    created_by: string;
    created_at: string;
    updated_at: string;
    published_at?: string;
    closed_at?: string;
}

export interface IResponse {
    id: string;
    rfpTitle: string;
    company: string;
    submittedAt: string;
    status: string;
    category: string;
} 