const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

function showManualSetupGuide() {
    console.log('🚀 Manual Database Setup Guide for Supabase\n');
    console.log('Since automated setup is not possible due to Supabase security restrictions,');
    console.log('you need to execute the database schema manually in your Supabase dashboard.\n');

    console.log('='.repeat(60));
    console.log('📋 STEP-BY-STEP INSTRUCTIONS');
    console.log('='.repeat(60));

    console.log('\n1️⃣  Open your Supabase Dashboard');
    console.log(`   URL: https://app.supabase.com/project/${getProjectId()}`);

    console.log('\n2️⃣  Navigate to SQL Editor');
    console.log('   • Click "SQL Editor" in the left sidebar');
    console.log('   • Click "New query" button');

    console.log('\n3️⃣  Copy the Database Schema');
    console.log('   • Open database-schema.sql in your project');
    console.log('   • Copy ALL content (Ctrl+A, Ctrl+C)');

    console.log('\n4️⃣  Paste and Execute');
    console.log('   • Paste the schema into the SQL Editor');
    console.log('   • Click "Run" button (or press Ctrl+Enter)');

    console.log('\n5️⃣  Verify Setup');
    console.log('   • Run: npm run verify-db');
    console.log('   • Check that all tables exist');

    console.log('\n6️⃣  Test Authentication');
    console.log('   • Run: npm run dev');
    console.log('   • Try to sign up a new user');
    console.log('   • Verify profile creation works');

    console.log('\n' + '='.repeat(60));
    console.log('🔍 WHAT THE SCHEMA CREATES');
    console.log('='.repeat(60));

    try {
        const schema = fs.readFileSync('./database-schema.sql', 'utf8');
        const tables = schema.match(/CREATE TABLE[^;]+;/g) || [];
        const functions = schema.match(/CREATE OR REPLACE FUNCTION[^;]+;/g) || [];
        const triggers = schema.match(/CREATE TRIGGER[^;]+;/g) || [];
        const policies = schema.match(/CREATE POLICY[^;]+;/g) || [];

        console.log(`\n📊 Tables (${tables.length}):`);
        tables.forEach(table => {
            const tableName = table.match(/CREATE TABLE[^(]+\(/)?.[0]?.replace('CREATE TABLE', '').replace('(', '').trim();
            if (tableName) console.log(`   • ${tableName}`);
        });

        console.log(`\n⚙️  Functions (${functions.length}):`);
        functions.forEach(func => {
            const funcName = func.match(/CREATE OR REPLACE FUNCTION ([^(]+)/)?.[1];
            if (funcName) console.log(`   • ${funcName}`);
        });

        console.log(`\n🔗 Triggers (${triggers.length}):`);
        triggers.forEach(trigger => {
            const triggerName = trigger.match(/CREATE TRIGGER ([^ ]+)/)?.[1];
            if (triggerName) console.log(`   • ${triggerName}`);
        });

        console.log(`\n🛡️  RLS Policies (${policies.length}):`);
        policies.forEach(policy => {
            const policyName = policy.match(/CREATE POLICY ([^ ]+)/)?.[1];
            if (policyName) console.log(`   • ${policyName}`);
        });

    } catch (error) {
        console.log('\n❌ Could not read database-schema.sql');
    }

    console.log('\n' + '='.repeat(60));
    console.log('⚠️  IMPORTANT NOTES');
    console.log('='.repeat(60));

    console.log('\n• The schema will create all necessary tables, functions, and policies');
    console.log('• Row Level Security (RLS) will be enabled for data protection');
    console.log('• User profiles will be automatically created when users sign up');
    console.log('• RFP management system will be ready for development');

    console.log('\n' + '='.repeat(60));
    console.log('🚨 TROUBLESHOOTING');
    console.log('='.repeat(60));

    console.log('\nIf you encounter errors during execution:');
    console.log('• Check that you have admin access to your Supabase project');
    console.log('• Ensure the SQL syntax is correct (copy the entire file)');
    console.log('• Look for specific error messages in the SQL Editor');
    console.log('• Contact Supabase support if needed');

    console.log('\n' + '='.repeat(60));
    console.log('🎯 NEXT STEPS AFTER SETUP');
    console.log('='.repeat(60));

    console.log('\n1. Verify database setup: npm run verify-db');
    console.log('2. Start development server: npm run dev');
    console.log('3. Test user registration and authentication');
    console.log('4. Implement RFP management features');
    console.log('5. Add file upload functionality');
    console.log('6. Implement real-time updates');

    console.log('\n🚀 Ready to proceed? Open your Supabase dashboard and follow the steps above!\n');
}

function getProjectId() {
    const url = process.env.SUPABASE_URL;
    if (url) {
        const match = url.match(/https:\/\/[^.]+\.supabase\.co/);
        if (match) {
            return match[0].split('.')[0].replace('https://', '');
        }
    }
    return process.env.SUPABASE_PROJECT_ID;
}

showManualSetupGuide(); 