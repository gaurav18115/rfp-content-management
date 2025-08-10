# Database Setup Guide

This guide will help you set up the database schema and Row Level Security (RLS) policies for the RFP Content Management System.

## Prerequisites

- Supabase project created
- Environment variables configured
- Access to Supabase dashboard

## Environment Variables

Ensure your `.env.local` file contains:

```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_OR_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Schema

### 1. User Profiles Table

```sql
-- Create user profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('buyer', 'supplier', 'admin')) NOT NULL,
  company_name TEXT,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### 2. RFP Management Tables

```sql
-- Create RFPs table
CREATE TABLE IF NOT EXISTS rfps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  budget_range TEXT,
  deadline DATE,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed', 'awarded')),
  buyer_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RFP responses table
CREATE TABLE IF NOT EXISTS rfp_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
  supplier_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  proposal TEXT,
  price DECIMAL(10,2),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'reviewed', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT,
  file_size INTEGER,
  rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE rfps ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfp_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

## Row Level Security Policies

### 1. Profiles Table Policies

```sql
-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 2. RFPs Table Policies

```sql
-- Buyers can view their own RFPs
CREATE POLICY "Buyers can view own RFPs" ON rfps
  FOR SELECT USING (
    auth.uid() = buyer_id OR 
    role = 'supplier' OR 
    role = 'admin'
  );

-- Buyers can create RFPs
CREATE POLICY "Buyers can create RFPs" ON rfps
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'buyer'
    )
  );

-- Buyers can update their own RFPs
CREATE POLICY "Buyers can update own RFPs" ON rfps
  FOR UPDATE USING (auth.uid() = buyer_id);

-- Buyers can delete their own RFPs
CREATE POLICY "Buyers can delete own RFPs" ON rfps
  FOR DELETE USING (auth.uid() = buyer_id);
```

### 3. RFP Responses Table Policies

```sql
-- Suppliers can view responses to RFPs they're interested in
CREATE POLICY "Suppliers can view own responses" ON rfp_responses
  FOR SELECT USING (
    auth.uid() = supplier_id OR
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role IN ('buyer', 'admin')
    )
  );

-- Suppliers can create responses
CREATE POLICY "Suppliers can create responses" ON rfp_responses
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'supplier'
    )
  );

-- Suppliers can update their own responses
CREATE POLICY "Suppliers can update own responses" ON rfp_responses
  FOR UPDATE USING (auth.uid() = supplier_id);
```

### 4. Documents Table Policies

```sql
-- Users can view documents related to RFPs they have access to
CREATE POLICY "Users can view accessible documents" ON documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM rfps r
      WHERE r.id = documents.rfp_id
      AND (
        r.buyer_id = auth.uid() OR
        documents.uploaded_by = auth.uid() OR
        EXISTS (
          SELECT 1 FROM rfp_responses rr
          WHERE rr.rfp_id = r.id AND rr.supplier_id = auth.uid()
        )
      )
    )
  );

-- Users can upload documents to RFPs they have access to
CREATE POLICY "Users can upload documents" ON documents
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM rfps r
      WHERE r.id = documents.rfp_id
      AND (
        r.buyer_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM rfp_responses rr
          WHERE rr.rfp_id = r.id AND rr.supplier_id = auth.uid()
        )
      )
    )
  );
```

## Database Triggers

### 1. Auto-create Profile on User Signup

```sql
-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'buyer'); -- Default role
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Update Timestamps

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables that need updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfps_updated_at
  BEFORE UPDATE ON rfps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rfp_responses_updated_at
  BEFORE UPDATE ON rfp_responses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Verification

After running all the SQL commands:

1. **Check Tables**: Go to Table Editor in Supabase dashboard
2. **Verify RLS**: Ensure RLS is enabled on all tables
3. **Test Policies**: Try creating/reading data with different user roles
4. **Check Triggers**: Verify profiles are auto-created on signup

## Troubleshooting

### Common Issues

1. **RLS Policies Not Working**
   - Ensure RLS is enabled on tables
   - Check policy syntax and conditions
   - Verify user authentication status

2. **Triggers Not Firing**
   - Check function permissions
   - Verify trigger attachment to tables
   - Check function syntax

3. **Permission Denied Errors**
   - Review RLS policies
   - Check user role assignments
   - Verify table ownership

### Testing RLS

Use the Supabase dashboard to test policies:

1. Create test users with different roles
2. Try to access data with each user
3. Verify policies are working as expected
4. Check console for any error messages
