export interface IRFP {
    id: string;
    title: string;
    company: string;
    location: string;
    deadline: string;
    status: string;
    responses: number;
    category: string;
}

export interface IResponse {
    id: string;
    rfpTitle: string;
    company: string;
    submittedAt: string;
    status: string;
    category: string;
} 