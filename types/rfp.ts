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

export interface RFPResponse {
    id: string;
    rfp_id: string;
    rfp_title: string;
    supplier_id: string;
    supplier_name: string;
    supplier_company: string;
    proposal: string;
    budget: number;
    timeline: string;
    experience: string;
    status: 'submitted' | 'under_review' | 'approved' | 'rejected';
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    rejection_reason?: string;
}