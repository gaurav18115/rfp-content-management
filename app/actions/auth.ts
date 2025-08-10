'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function confirmEmail(code: string) {
    const supabase = await createClient();

    try {
        // Exchange the code for a session
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('Error exchanging code for session:', error);
            return { error: error.message };
        }

        if (data.session) {
            console.log('Email confirmation successful, user is now authenticated');
            redirect('/dashboard');
        } else {
            console.log('No session created, redirecting to login');
            redirect('/auth/login');
        }
    } catch (error) {
        console.error('Exception during email confirmation:', error);
        return { error: 'Email confirmation failed' };
    }
} 