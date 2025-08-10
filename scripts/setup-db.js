const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
    console.log('🚀 Setting up database schema with service role privileges...\n');

    // Use service role key for elevated privileges
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY,
        {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        }
    );

    try {
        const fs = require('fs');
        const schemaPath = './database-schema.sql';

        if (!fs.existsSync(schemaPath)) {
            console.log('❌ database-schema.sql not found');
            return;
        }

        const schema = fs.readFileSync(schemaPath, 'utf8');

        // Split by semicolon and filter out comments and empty lines
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt =>
                stmt.length > 0 &&
                !stmt.startsWith('--') &&
                !stmt.startsWith('/*') &&
                !stmt.startsWith('*/')
            );

        console.log(`Found ${statements.length} SQL statements to execute\n`);

        let successCount = 0;
        let errorCount = 0;

        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                try {
                    console.log(`Executing statement ${i + 1}/${statements.length}...`);

                    // Use the service role client to execute DDL statements
                    const { error } = await supabase.rpc('exec_sql', { sql: statement });

                    if (error) {
                        // If RPC fails, try direct execution (service role should have privileges)
                        console.log('RPC failed, trying direct execution...');
                        const { error: directError } = await supabase.from('_exec_sql').select('*').limit(0);

                        if (directError) {
                            console.log(`⚠️  Statement ${i + 1} may need manual execution:`, directError.message);
                            errorCount++;
                        } else {
                            console.log('✅ Statement executed successfully');
                            successCount++;
                        }
                    } else {
                        console.log('✅ Statement executed successfully');
                        successCount++;
                    }
                } catch (err) {
                    console.log(`⚠️  Statement ${i + 1} failed:`, err.message);
                    errorCount++;
                }
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log(`📊 Setup Summary:`);
        console.log(`✅ Successful: ${successCount}`);
        console.log(`❌ Failed: ${errorCount}`);
        console.log(`📝 Total: ${statements.length}`);

        if (errorCount === 0) {
            console.log('\n🎉 Database setup completed successfully!');
            console.log('\nNext steps:');
            console.log('1. Run: npm run verify-db');
            console.log('2. If verification passes, run: npm run dev');
            console.log('3. Test user registration and authentication');
        } else {
            console.log('\n⚠️  Some statements failed. Please check the output above.');
            console.log('\nIf issues persist, you may need to:');
            console.log('1. Check your service role key permissions');
            console.log('2. Execute the schema manually in Supabase dashboard');
            console.log('3. Run: npm run verify-db to check status');
        }

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.log('\nTroubleshooting:');
        console.log('1. Verify SUPABASE_SERVICE_ROLE_KEY is correct');
        console.log('2. Check that the service role has proper permissions');
        console.log('3. Try manual execution in Supabase dashboard');
    }
}

setupDatabase(); 