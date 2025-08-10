// Utility functions for making API calls to our server-side endpoints
import { User, Session } from "@supabase/supabase-js";

export async function apiCall<T = unknown>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
}

// API response types
export interface AuthResponse {
    user: User;
    session: Session;
}

export interface SessionResponse {
    session: Session | null;
}

export interface UserResponse {
    user: User | null;
}

export interface ProfileResponse {
    user: User;
    profile: UserProfile;
}

export interface ProfileUpdateResponse {
    success: boolean;
}

export interface LogoutResponse {
    success: boolean;
}

export interface ForgotPasswordResponse {
    success: boolean;
}

export interface UpdatePasswordResponse {
    success: boolean;
}

// UserProfile type definition
export interface UserProfile {
    id: string;
    email: string;
    role: "buyer" | "supplier";
    company_name?: string;
    contact_phone?: string;
    created_at?: string;
    updated_at?: string;
}

// Auth API functions
export const authApi = {
    login: (email: string, password: string) =>
        apiCall<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        }),

    signup: (email: string, password: string, role: 'buyer' | 'supplier') =>
        apiCall<AuthResponse>('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, role }),
        }),

    logout: () =>
        apiCall<LogoutResponse>('/api/auth/logout', {
            method: 'POST',
        }),

    forgotPassword: (email: string) =>
        apiCall<ForgotPasswordResponse>('/api/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email }),
        }),

    updatePassword: (password: string) =>
        apiCall<UpdatePasswordResponse>('/api/auth/update-password', {
            method: 'POST',
            body: JSON.stringify({ password }),
        }),

    getSession: () =>
        apiCall<SessionResponse>('/api/auth/session'),

    getUser: () =>
        apiCall<UserResponse>('/api/auth/user'),
};

// Profile API functions
export const profileApi = {
    getMe: () =>
        apiCall<ProfileResponse>('/api/profile/me'),

    update: (company_name: string, contact_phone: string) =>
        apiCall<ProfileUpdateResponse>('/api/profile', {
            method: 'PUT',
            body: JSON.stringify({ company_name, contact_phone }),
        }),
}; 