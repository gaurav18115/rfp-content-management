const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyDatabase() {
    console.log('🔍 Verifying database setup...\n');

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
    );

    const requiredTables = [
        'user_profiles',
        'rfps',
        'rfp_responses',
        'documents'
    ];

    let allTablesExist = true;

    for (const table of requiredTables) {
        try {
            console.log(`Checking table: ${table}...`);
            const { error } = await supabase.from(table).select('*').limit(1);

            if (error) {
                console.log(`❌ ${table}: ${error.message}`);
                allTablesExist = false;
            } else {
                console.log(`✅ ${table}: exists`);
            }
        } catch (err) {
            console.log(`❌ ${table}: ${err.message}`);
            allTablesExist = false;
        }
    }

    console.log('\n' + '='.repeat(50));

    if (allTablesExist) {
        console.log('🎉 All required tables exist! Database setup is complete.');
        console.log('\nNext steps:');
        console.log('1. Run: npm run dev');
        console.log('2. Test user registration and authentication');
        console.log('3. Verify profile creation works');
    } else {
        console.log('⚠️  Some tables are missing. Please complete the database setup:');
        console.log('\n1. Go to your Supabase dashboard > SQL Editor');
        console.log('2. Copy and paste the contents of database-schema.sql');
        console.log('3. Execute the SQL script');
        console.log('4. Run this script again: npm run verify-db');
    }
}

verifyDatabase().catch(console.error); 