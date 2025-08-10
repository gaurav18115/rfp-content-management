const https = require('https');
const http = require('http');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Demo accounts configuration
const demoAccounts = [
    {
        email: 'buyer@test.com',
        password: 'password123',
        role: 'buyer',
        first_name: 'Demo',
        last_name: 'Buyer',
        company_name: 'Demo Buyer Corp',
        contact_phone: '+1-555-0001'
    },
    {
        email: 'supplier@test.com',
        password: 'password123',
        role: 'supplier',
        first_name: 'Demo',
        last_name: 'Supplier',
        company_name: 'Demo Supplier Inc',
        contact_phone: '+1-555-0002'
    }
];

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
        const urlObj = new URL(url);
        const isHttps = urlObj.protocol === 'https:';
        const client = isHttps ? https : http;

        const requestOptions = {
            hostname: urlObj.hostname,
            port: urlObj.port || (isHttps ? 443 : 3000),
            path: urlObj.pathname + urlObj.search,
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        };

        if (options.body) {
            const bodyString = JSON.stringify(options.body);
            requestOptions.headers['Content-Type'] = 'application/json';
            requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyString);
        }

        const req = client.request(requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: jsonData
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        headers: res.headers,
                        data: data
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }

        req.end();
    });
}

async function seedDemoAccounts() {
    try {
        console.log('🌱 Starting demo account seeding...');
        console.log('📋 Accounts to create:');
        demoAccounts.forEach(account => {
            console.log(`   • ${account.email} (${account.role})`);
        });
        console.log('');

        // Check if the server is running
        try {
            const healthCheck = await makeRequest(`${BASE_URL}/api/auth/session`);
            console.log('✅ Server is running and accessible');
        } catch (error) {
            console.error('❌ Server is not accessible. Please start the development server with:');
            console.error('   pnpm run dev');
            process.exit(1);
        }

        for (const account of demoAccounts) {
            console.log(`🔧 Creating account: ${account.email}`);

            try {
                // Create user via signup API
                const signupResponse = await makeRequest(`${BASE_URL}/api/auth/signup`, {
                    method: 'POST',
                    body: {
                        email: account.email,
                        password: account.password,
                        role: account.role
                    }
                });

                if (signupResponse.status === 200) {
                    console.log(`   ✅ User ${account.email} created successfully`);

                    // Try to confirm email (this might not work without proper setup)
                    try {
                        const confirmResponse = await makeRequest(`${BASE_URL}/api/auth/confirm-email`, {
                            method: 'POST',
                            body: {
                                email: account.email,
                                code: '000000' // This won't work without proper email confirmation
                            }
                        });

                        if (confirmResponse.status === 200) {
                            console.log(`   ✅ Email confirmed for ${account.email}`);
                        } else {
                            console.log(`   ⚠️  Email confirmation failed for ${account.email} (this is expected)`);
                            console.log(`   💡 You may need to manually confirm the email or check your email for a confirmation code`);
                        }
                    } catch (confirmError) {
                        console.log(`   ⚠️  Email confirmation failed for ${account.email} (this is expected)`);
                    }

                } else {
                    if (signupResponse.data?.error?.includes('already registered')) {
                        console.log(`   ⚠️  User ${account.email} already exists, skipping creation`);
                    } else {
                        console.error(`   ❌ Failed to create user ${account.email}:`, signupResponse.data?.error || 'Unknown error');
                    }
                }

            } catch (error) {
                console.error(`   ❌ Error creating account ${account.email}:`, error.message);
            }
        }

        console.log('\n🎉 Demo account seeding completed!');
        console.log('\n📝 Demo Account Credentials:');
        console.log('   Buyer:   buyer@test.com / password123');
        console.log('   Supplier: supplier@test.com / password123');
        console.log('\n⚠️  Important Notes:');
        console.log('   1. Email confirmation may be required before login');
        console.log('   2. Check your email for confirmation codes');
        console.log('   3. You may need to manually confirm emails in Supabase dashboard');
        console.log('\n💡 You can now test these accounts in the application');

    } catch (error) {
        console.error('❌ Unexpected error during seeding:', error.message);
        process.exit(1);
    }
}

// Run the seeding
seedDemoAccounts(); 