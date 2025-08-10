-- Database Migration: Add first_name and last_name to user_profiles
-- Run this script if you have an existing database with the old schema

-- Add first_name and last_name columns to existing user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Update the updated_at timestamp for all existing rows
UPDATE public.user_profiles 
SET updated_at = NOW() 
WHERE first_name IS NULL OR last_name IS NULL;

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
AND table_schema = 'public'
ORDER BY ordinal_position; 