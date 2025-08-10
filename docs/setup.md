# RFP Content Management System - Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Git

## Initial Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <your-repo>
   cd rfp-content-management
   npm install
   ```

2. **Environment setup:**

   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your_supabase_anon_key
   ```

## Database Setup (Manual - Required)

**IMPORTANT**: The automated database setup script cannot work because Supabase client libraries cannot execute DDL statements. You must manually set up the database schema.

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com) and sign in
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar

### Step 2: Execute Database Schema

1. Copy the entire contents of `sql/database-schema.sql`
2. Paste it into the SQL Editor in Supabase
3. Click **Run** to execute all statements

### Step 3: Verify Setup

1. Go to **Table Editor** in the left sidebar
2. Verify these tables exist:
   - `user_profiles`
   - `rfps`
   - `rfp_responses`
   - `documents`

### Step 4: Test Database Connection

```bash
npm run test-db
```

You should see: `✅ Database connection successful!`

## Development

1. **Start the development server:**

   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## What's Implemented

✅ **Authentication System**

- Supabase email/password authentication
- User registration with role selection (buyer/supplier)
- Automatic user profile creation via database triggers
- User context for global state management
- Protected routes and authentication guards

✅ **Database Schema**

- User profiles with roles and company information
- RFP management tables (rfps, rfp_responses, documents)
- Row Level Security (RLS) policies
- Database triggers for automatic profile creation
- Updated timestamp management

✅ **Core Components**

- Sign up form with role selection
- Login form
- Profile management form
- Authentication button with user info
- Logout functionality
- Responsive UI with Tailwind CSS

## Next Steps

🚧 **RFP Management System**

- Create RFP form for buyers
- File upload functionality
- RFP listing and search
- Response submission for suppliers

🚧 **User Dashboards**

- Buyer dashboard for RFP management
- Supplier dashboard for response tracking
- Admin dashboard for system management

🚧 **Advanced Features**

- Real-time notifications
- Document management
- Advanced search and filtering
- Analytics and reporting

## Troubleshooting

### Database Connection Issues

- Ensure your `.env.local` has correct Supabase credentials
- Verify the database schema was executed in Supabase dashboard
- Check that RLS policies are properly configured

### Authentication Issues

- Clear browser cookies and local storage
- Verify Supabase project settings (email confirmations, etc.)
- Check browser console for error messages

### Build Issues

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
