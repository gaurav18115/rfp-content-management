# Setup Guide

This guide will help you set up the RFP Content Management System with Supabase authentication and database.

## Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Supabase account and project
- Git

## 1. Clone the Repository

```bash
git clone <your-repo-url>
cd rfp-content-management
```

## 2. Install Dependencies

```bash
pnpm install
```

## 3. Environment Configuration

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database Configuration
DATABASE_URL=your_database_url

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select existing one
3. Go to Settings > API
4. Copy the following values:
   - Project URL → `SUPABASE_URL`
   - anon/public key → `SUPABASE_PUBLISHABLE_OR_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

## 4. Database Setup

Run the database setup script:

```bash
pnpm run setup:db
```

This will:

- Create necessary tables
- Set up Row Level Security (RLS) policies
- Create initial data structures

## 5. Start Development Server

```bash
pnpm run dev
```

Your application should now be running at `http://localhost:3000`

## 6. Verify Setup

1. Visit the application in your browser
2. Try to sign up with a test email
3. Check the database to ensure user profiles are created
4. Test authentication flow

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loaded**
   - Ensure `.env.local` is in the root directory
   - Restart the development server after adding variables

2. **Database Connection Errors**
   - Verify `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_OR_ANON_KEY`
   - Check if your Supabase project is active

3. **Authentication Issues**
   - Verify email confirmation is set up in Supabase
   - Check RLS policies are properly configured

### Getting Help

If you encounter issues:

1. Check the console for error messages
2. Verify environment variables are correct
3. Check Supabase project status
4. Review RLS policies in Supabase dashboard
