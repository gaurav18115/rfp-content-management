const https = require('https');
const http = require('http');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Demo account credentials
const demoAccounts = [
    {
        email: 'buyer@test.com',
        password: 'password123',
        role: 'buyer'
    },
    {
        email: 'supplier@test.com',
        password: 'password123',
        role: 'supplier'
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

async function verifyDemoAccounts() {
    try {
        console.log('🔍 Verifying demo accounts...\n');

        // Check if server is running
        try {
            await makeRequest(`${BASE_URL}/api/auth/session`);
            console.log('✅ Server is accessible');
        } catch (error) {
            console.error('❌ Server is not accessible. Please start with: pnpm run dev');
            return;
        }

        console.log('\n📋 Testing demo account functionality:\n');

        for (const account of demoAccounts) {
            console.log(`🔐 Testing ${account.role} account: ${account.email}`);

            try {
                // Test login
                const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
                    method: 'POST',
                    body: {
                        email: account.email,
                        password: account.password
                    }
                });

                if (loginResponse.status === 200) {
                    console.log(`   ✅ Login successful for ${account.email}`);

                    // Check if we got a session
                    if (loginResponse.data?.session) {
                        console.log(`   ✅ Session created successfully`);
                    } else {
                        console.log(`   ⚠️  No session returned (may need email confirmation)`);
                    }

                } else {
                    console.log(`   ❌ Login failed for ${account.email}:`, loginResponse.data?.error || 'Unknown error');

                    if (loginResponse.data?.error?.includes('Email not confirmed')) {
                        console.log(`   💡 Email confirmation required for ${account.email}`);
                        console.log(`   🔧 You may need to manually confirm the email in Supabase dashboard`);
                    }
                }

            } catch (error) {
                console.log(`   ❌ Error testing ${account.email}:`, error.message);
            }

            console.log(''); // Empty line for readability
        }

        console.log('🎯 Demo Account Summary:');
        console.log('   • buyer@test.com / password123 (Role: Buyer)');
        console.log('   • supplier@test.com / password123 (Role: Supplier)');

        console.log('\n💡 Usage Instructions:');
        console.log('   1. Navigate to the login page in your browser');
        console.log('   2. Use the credentials above to test login');
        console.log('   3. Verify role-based access control works correctly');
        console.log('   4. Test the application functionality with each role');

        console.log('\n⚠️  Important Notes:');
        console.log('   • Email confirmation may be required before login');
        console.log('   • Check Supabase dashboard for email confirmation status');
        console.log('   • These are test accounts - do not use in production');

        console.log('\n✅ Demo account verification completed!');

    } catch (error) {
        console.error('❌ Verification failed:', error.message);
        process.exit(1);
    }
}

verifyDemoAccounts(); 