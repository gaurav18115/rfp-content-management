# SQL Files Directory

This directory contains all database-related SQL files for the RFP Content Management System.

## Files

### `database-schema.sql`

The main database schema file that creates all tables, indexes, policies, and functions needed for the system. Use this file for initial database setup.

**What it creates:**

- `user_profiles` table with user information and roles
- `rfps` table for Request for Proposals
- `rfp_responses` table for supplier responses
- `documents` table for file management
- Row Level Security (RLS) policies
- Database triggers and functions
- Proper indexes for performance

### `database-migration.sql`

Migration script to add new fields to existing databases. Use this if you need to add `first_name` and `last_name` columns to an existing `user_profiles` table.

**What it does:**

- Adds `first_name` and `last_name` columns
- Updates timestamps for existing records
- Verifies the schema changes

## Usage

### For New Databases

1. Copy the contents of `database-schema.sql`
2. Paste into Supabase SQL Editor
3. Execute all statements

### For Existing Databases

1. Copy the contents of `database-migration.sql`
2. Paste into Supabase SQL Editor
3. Execute the migration script

## Database Requirements

- Supabase project with PostgreSQL
- Access to SQL Editor
- Proper environment variables configured
