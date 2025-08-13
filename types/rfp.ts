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
    rfp_id: string;
    supplier_id: string;
    proposal: string;
    budget: number;
    timeline: string;
    experience: string;
    status: string;
    submitted_at: string;
    reviewed_at?: string;
    reviewed_by?: string;
    rejection_reason?: string;
    user_profiles?: {
        company_name?: string;
        first_name?: string;
        last_name?: string;
        email?: string;
    };
}

export interface IResponseWithRFP extends IResponse {
    rfp_title: string;
    rfp_company?: string;
    rfp_category?: string;
    rfp_deadline?: string;
    rfp_budget_range?: string;
    supplier_name?: string;
    supplier_company?: string;
}