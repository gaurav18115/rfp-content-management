const https = require('https');
const http = require('http');
require('dotenv').config({ path: '.env.local' });

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

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

async function testSeeding() {
    try {
        console.log('🧪 Testing demo account seeding...\n');

        // Test 1: Check if server is accessible
        console.log('📋 Test 1: Checking server accessibility...');
        try {
            const healthCheck = await makeRequest(`${BASE_URL}/api/auth/session`);
            console.log('   ✅ Server is accessible');
        } catch (error) {
            console.log('   ❌ Server is not accessible:', error.message);
            console.log('   💡 Please start the development server with: pnpm run dev');
            return;
        }

        // Test 2: Check if demo accounts can be created
        console.log('\n📋 Test 2: Testing account creation...');

        const demoEmails = ['buyer@test.com', 'supplier@test.com'];

        for (const email of demoEmails) {
            try {
                // Try to create a test account
                const response = await makeRequest(`${BASE_URL}/api/auth/signup`, {
                    method: 'POST',
                    body: {
                        email: email,
                        password: 'password123',
                        role: email.includes('buyer') ? 'buyer' : 'supplier'
                    }
                });

                if (response.status === 200) {
                    console.log(`   ✅ Account creation endpoint working for ${email}`);
                } else if (response.data?.error?.includes('already registered')) {
                    console.log(`   ✅ Account ${email} already exists (expected for demo accounts)`);
                } else {
                    console.log(`   ⚠️  Account creation failed for ${email}:`, response.data?.error || 'Unknown error');
                }
            } catch (error) {
                console.log(`   ❌ Error testing account creation for ${email}:`, error.message);
            }
        }

        // Test 3: Test login functionality
        console.log('\n📋 Test 3: Testing login functionality...');

        try {
            const loginResponse = await makeRequest(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                body: {
                    email: 'buyer@test.com',
                    password: 'password123'
                }
            });

            if (loginResponse.status === 200) {
                console.log('   ✅ Login endpoint working');
            } else {
                console.log('   ⚠️  Login endpoint returned:', loginResponse.status, loginResponse.data?.error || 'Unknown error');
            }
        } catch (error) {
            console.log('   ❌ Error testing login:', error.message);
        }

        // Test 4: Check API endpoints
        console.log('\n📋 Test 4: Checking available API endpoints...');

        const endpoints = [
            '/api/auth/signup',
            '/api/auth/login',
            '/api/auth/session',
            '/api/profile'
        ];

        for (const endpoint of endpoints) {
            try {
                const response = await makeRequest(`${BASE_URL}${endpoint}`);
                console.log(`   ✅ ${endpoint} - Status: ${response.status}`);
            } catch (error) {
                console.log(`   ❌ ${endpoint} - Error: ${error.message}`);
            }
        }

        console.log('\n🎉 Seeding test completed!');
        console.log('\n💡 Next steps:');
        console.log('   1. Run the seeding script: pnpm run seed-demo');
        console.log('   2. Test login with the demo accounts');
        console.log('   3. Verify role-based access control');
        console.log('\n⚠️  Note: Email confirmation may be required before login');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

testSeeding(); 