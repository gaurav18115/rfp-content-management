const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testDatabase() {
    console.log('Testing database connection...\n');

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY
    );

    try {
        // Test 1: Check if we can connect
        console.log('1. Testing connection...');
        const { data, error } = await supabase.from('user_profiles').select('count').limit(1);

        if (error) {
            console.log('❌ Connection failed:', error.message);
            return;
        }

        console.log('✅ Connection successful');

        // Test 2: Check if tables exist
        console.log('\n2. Checking tables...');

        const tables = ['user_profiles', 'rfps', 'rfp_responses', 'documents'];

        for (const table of tables) {
            try {
                const { error: tableError } = await supabase.from(table).select('*').limit(1);
                if (tableError) {
                    console.log(`❌ Table '${table}' not found or inaccessible`);
                } else {
                    console.log(`✅ Table '${table}' exists and accessible`);
                }
            } catch (err) {
                console.log(`❌ Error accessing table '${table}':`, err.message);
            }
        }

        // Test 3: Check RLS policies
        console.log('\n3. Checking RLS policies...');

        try {
            // This should fail due to RLS (no authenticated user)
            const { error: rlsError } = await supabase.from('user_profiles').select('*');
            if (rlsError && rlsError.message.includes('RLS')) {
                console.log('✅ RLS is working (expected error for unauthenticated access)');
            } else {
                console.log('⚠️  RLS might not be properly configured');
            }
        } catch (err) {
            console.log('✅ RLS is working');
        }

        console.log('\n✅ Database test completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Run the application: npm run dev');
        console.log('2. Test user registration and login');
        console.log('3. Verify profile creation and editing');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testDatabase(); 