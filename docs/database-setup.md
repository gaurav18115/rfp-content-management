# Database Setup Guide

## Why Manual Setup is Required

The automated database setup script cannot work because:

- Supabase client libraries cannot execute DDL (Data Definition Language) statements
- DDL operations require higher database privileges
- Security restrictions prevent direct SQL execution from application code

## Prerequisites

1. **Supabase Project**: You must have a Supabase project created
2. **Project Credentials**: Your `.env.local` file should contain:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
   ```

## Step-by-Step Database Setup

### Step 1: Access Supabase Dashboard

1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project from the dashboard

### Step 2: Navigate to SQL Editor

1. In the left sidebar, click **SQL Editor**
2. You'll see a query editor interface

### Step 3: Execute Database Schema

1. **Copy the schema**: Open `database-schema.sql` in your project
2. **Select all content**: Ctrl+A (or Cmd+A on Mac) to select everything
3. **Copy**: Ctrl+C (or Cmd+C on Mac)
4. **Paste in Supabase**: Click in the SQL Editor and paste (Ctrl+V or Cmd+V)
5. **Execute**: Click the **Run** button (or press Ctrl+Enter)

### Step 4: Verify Tables Created

1. In the left sidebar, click **Table Editor**
2. You should see these tables:
   - `user_profiles`
   - `rfps`
   - `rfp_responses`
   - `documents`

### Step 5: Test Database Connection

Run the verification script:

```bash
npm run verify-db
```

You should see all tables marked with ✅.

## What the Schema Creates

### Tables

- **`user_profiles`**: User information and roles
- **`rfps`**: Request for Proposal data
- **`rfp_responses`**: Supplier responses to RFPs
- **`documents`**: File storage and management

### Functions

- **`handle_new_user()`**: Automatically creates user profiles on signup
- **`publish_rfp()`**: Manages RFP publication workflow
- **`close_rfp()`**: Handles RFP closure and status updates

### Triggers

- **`on_auth_user_created`**: Fires when a new user signs up
- **`update_updated_at_column`**: Automatically updates timestamps

### RLS Policies

- Row Level Security policies for data protection
- Users can only access their own data
- Role-based permissions for different operations

## Troubleshooting

### Common Issues

1. **"relation does not exist" errors**
   - The schema wasn't executed completely
   - Re-run the entire `database-schema.sql` file

2. **Permission denied errors**
   - Ensure you're using the correct Supabase project
   - Check that your account has project access

3. **Function creation errors**
   - Some functions may already exist
   - This is normal and can be ignored

### Verification Commands

Test individual table access:

```bash
# Test user_profiles table
npm run test-db

# Verify all tables exist
npm run verify-db
```

## Next Steps

After successful database setup:

1. **Test Authentication**:

   ```bash
   npm run dev
   ```

   - Navigate to `/auth/sign-up`
   - Create a test user
   - Verify profile is created automatically

2. **Check Profile Creation**:
   - Sign up with a new user
   - Check Supabase Table Editor > `user_profiles`
   - Verify the new profile was created

3. **Test RLS Policies**:
   - Try accessing data with different users
   - Verify security policies are working

## Support

If you encounter issues:

1. Check the Supabase dashboard for error messages
2. Verify your `.env.local` credentials
3. Ensure you're in the correct Supabase project
4. Check the browser console for client-side errors

---

**Note**: This setup is a one-time process. Once completed, your database will be ready for the RFP management system.
