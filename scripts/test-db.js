const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_OR_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing environment variables:');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
    console.error('   SUPABASE_PUBLISHABLE_OR_ANON_KEY:', supabaseKey ? '✅' : '❌');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    try {
        console.log('🔌 Testing database connection...');

        // Test basic connection
        const { data, error } = await supabase.from('profiles').select('count').limit(1);

        if (error) {
            console.error('❌ Database connection failed:', error.message);
            return;
        }

        console.log('✅ Database connection successful!');
        console.log('📊 Data:', data);

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

testConnection(); 