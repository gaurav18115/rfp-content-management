# Demo Account Seeding

This document explains how to use the demo account seeding functionality for the RFP Content Management System.

## 🎯 Purpose

The seeding script creates test accounts that can be used for:

- Development and testing
- Demo presentations
- Code reviews
- User acceptance testing

## 📋 Demo Accounts Created

The seeding script creates the following accounts:

| Email | Password | Role | Company |
|-------|----------|------|---------|
| `buyer@test.com` | `password123` | Buyer | Demo Buyer Corp |
| `supplier@test.com` | `password123` | Supplier | Demo Supplier Inc |

## 🚀 Quick Start

### Prerequisites

1. **Environment Variables**: Ensure you have the following in your `.env.local`:

   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

2. **Database Setup**: Make sure your database tables are created:

   ```bash
   pnpm run setup-db
   ```

### Running the Seeding Script

```bash
pnpm run seed-demo
```

### Verifying the Seeding

```bash
pnpm run test-seeding
```

## 🔧 How It Works

### 1. User Creation

- Creates users in Supabase Auth with auto-confirmed emails
- Sets user metadata including role information

### 2. Profile Creation

- Creates corresponding records in the `user_profiles` table
- Links profiles to auth users via UUID
- Sets role-based permissions

### 3. Idempotency

- Safe to run multiple times
- Checks for existing users before creation
- Updates profiles if they already exist

## 📊 Database Schema

The seeding script works with the following table structure:

```sql
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('buyer', 'supplier')),
  first_name TEXT,
  last_name TEXT,
  company_name TEXT,
  contact_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🛡️ Security Considerations

- **Service Role Key**: The script uses the service role key for admin operations
- **Environment Variables**: Never commit `.env.local` to version control
- **Demo Passwords**: These are test accounts only - change passwords in production

## 🧪 Testing

### Manual Testing

1. Run the seeding script
2. Navigate to the login page
3. Test login with demo credentials
4. Verify role-based access control

### Automated Testing

```bash
pnpm run test-seeding
```

## 🚨 Troubleshooting

### Common Issues

1. **Missing Service Role Key**

   ```
   ❌ Missing environment variables: SUPABASE_SERVICE_ROLE_KEY
   ```

   **Solution**: Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env.local`

2. **Database Connection Failed**

   ```
   ❌ Database connection failed
   ```

   **Solution**: Verify your Supabase URL and keys are correct

3. **Table Does Not Exist**

   ```
   ❌ relation "user_profiles" does not exist
   ```

   **Solution**: Run `pnpm run setup-db` first

### Debug Mode

For detailed logging, you can modify the script to add more verbose output.

## 📝 Customization

To modify the demo accounts:

1. Edit `scripts/seed-demo-accounts.js`
2. Update the `demoAccounts` array
3. Run the seeding script again

## 🔄 Cleanup

To remove demo accounts:

```sql
-- Remove profiles (this will cascade to related data)
DELETE FROM user_profiles WHERE email IN ('buyer@test.com', 'supplier@test.com');

-- Remove auth users (requires service role)
-- This should be done through Supabase dashboard or admin API
```

## 📚 Related Documentation

- [Main README](../readme.md)
- [Database Schema](../sql/database-schema.sql)
- [Authentication Guide](../docs/auth-guide.md)
- [Setup Instructions](../docs/setup.md)

---

**Last Updated**: December 2024  
**Version**: 1.0.0
