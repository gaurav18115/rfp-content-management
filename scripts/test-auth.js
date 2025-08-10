#!/usr/bin/env node

/**
 * Simple Authentication API Test Script
 * Tests the core authentication endpoints without requiring a browser
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

// Load test users from JSON file
let testUsers;
try {
    const testUsersPath = path.join(__dirname, '..', 'test-users.json');
    const testUsersData = fs.readFileSync(testUsersPath, 'utf8');
    testUsers = JSON.parse(testUsersData);
    console.log('📋 Loaded test users from test-users.json');
} catch (error) {
    console.error('❌ Failed to load test-users.json:', error.message);
    console.log('🔄 Falling back to default test users...');

    // Fallback test users if JSON file can't be loaded
    testUsers = {
        buyer: {
            email: `testbuyer${Date.now()}@gmail.com`,
            password: 'SecurePassword123!',
            role: 'buyer'
        },
        supplier: {
            email: `testsupplier${Date.now()}@gmail.com`,
            password: 'SecurePassword123!',
            role: 'supplier'
        }
    };
}

let authToken = null;

// Function to confirm user email using service role (for testing only)
async function confirmUserEmail(email) {
    try {
        const response = await makeRequest(`${BASE_URL}/api/auth/confirm-email`, {
            method: 'POST',
            body: { email }
        });
        return response.status === 200;
    } catch (error) {
        console.log(`⚠️ Could not confirm email for ${email}:`, error.message);
        return false;
    }
}

// Function to clean up test users (for testing only)
async function cleanupTestUser(email) {
    try {
        const response = await makeRequest(`${BASE_URL}/api/auth/cleanup-user`, {
            method: 'DELETE',
            body: { email }
        });
        return response.status === 200;
    } catch (error) {
        console.log(`⚠️ Could not cleanup user ${email}:`, error.message);
        return false;
    }
}

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

// Test functions
async function testSignup(userData) {
    console.log(`\n🔐 Testing signup for ${userData.role}...`);

    try {
        const response = await makeRequest(`${BASE_URL}/api/auth/signup`, {
            method: 'POST',
            body: userData
        });

        if (response.status === 200) {
            console.log(`✅ ${userData.role} signup successful`);

            // Confirm the user's email for testing
            console.log(`📧 Confirming email for ${userData.role}...`);
            const confirmed = await confirmUserEmail(userData.email);
            if (confirmed) {
                console.log(`✅ ${userData.role} email confirmed`);
            } else {
                console.log(`⚠️ ${userData.role} email confirmation failed`);
            }

            return true;
        } else {
            console.log(`❌ ${userData.role} signup failed:`, response.status, response.data);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${userData.role} signup error:`, error.message);
        return false;
    }
}

async function testLogin(userData) {
    console.log(`\n🔑 Testing login for ${userData.role}...`);

    try {
        const response = await makeRequest(`${BASE_URL}/api/auth/login`, {
            method: 'POST',
            body: {
                email: userData.email,
                password: userData.password
            }
        });

        if (response.status === 200) {
            console.log(`✅ ${userData.role} login successful`);
            // Store token for subsequent requests
            if (response.data.session?.access_token) {
                authToken = response.data.session.access_token;
                console.log(`🔑 Auth token received`);
            }
            return true;
        } else {
            console.log(`❌ ${userData.role} login failed:`, response.status, response.data);
            return false;
        }
    } catch (error) {
        console.log(`❌ ${userData.role} login error:`, error.message);
        return false;
    }
}

async function testProtectedEndpoint() {
    console.log(`\n🛡️ Testing protected endpoint access...`);

    if (!authToken) {
        console.log(`⚠️ No auth token available, skipping protected endpoint test`);
        return;
    }

    try {
        const response = await makeRequest(`${BASE_URL}/api/test/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 200) {
            console.log(`✅ Protected endpoint accessible with valid token`);
            console.log(`👤 User profile:`, response.data);
        } else {
            console.log(`❌ Protected endpoint access failed:`, response.status, response.data);
        }
    } catch (error) {
        console.log(`❌ Protected endpoint test error:`, error.message);
    }
}

async function testUnauthenticatedAccess() {
    console.log(`\n🚫 Testing unauthenticated access to protected endpoint...`);

    try {
        const response = await makeRequest(`${BASE_URL}/api/profile/me`, {
            method: 'GET'
        });

        if (response.status === 401) {
            console.log(`✅ Protected endpoint correctly rejects unauthenticated access`);
        } else {
            console.log(`❌ Protected endpoint should reject unauthenticated access:`, response.status);
        }
    } catch (error) {
        console.log(`❌ Unauthenticated access test error:`, error.message);
    }
}

async function testSessionEndpoint() {
    console.log(`\n📋 Testing session endpoint...`);

    try {
        const response = await makeRequest(`${BASE_URL}/api/auth/session`);

        if (response.status === 200) {
            console.log(`✅ Session endpoint accessible`);
            console.log(`📋 Session data:`, response.data);
        } else {
            console.log(`❌ Session endpoint failed:`, response.status, response.data);
        }
    } catch (error) {
        console.log(`❌ Session endpoint test error:`, error.message);
    }
}

// Main test runner
async function runTests() {
    console.log('🚀 Starting Authentication & RBAC Tests');
    console.log(`📍 Testing against: ${BASE_URL}`);
    console.log('='.repeat(50));

    // Test signup for both roles
    const buyerSignupSuccess = await testSignup(testUsers.buyer);
    const supplierSignupSuccess = await testSignup(testUsers.supplier);

    // Test login for both roles
    const buyerLoginSuccess = await testLogin(testUsers.buyer);
    const supplierLoginSuccess = await testLogin(testUsers.supplier);

    // Test protected endpoints
    await testProtectedEndpoint();
    await testUnauthenticatedAccess();
    await testSessionEndpoint();

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Test Summary:');
    console.log(`✅ Buyer Signup (${testUsers.buyer.email}): ${buyerSignupSuccess ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Supplier Signup (${testUsers.supplier.email}): ${supplierSignupSuccess ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Buyer Login (${testUsers.buyer.email}): ${buyerLoginSuccess ? 'PASS' : 'FAIL'}`);
    console.log(`✅ Supplier Login (${testUsers.supplier.email}): ${supplierLoginSuccess ? 'PASS' : 'FAIL'}`);

    const allTestsPassed = buyerSignupSuccess && supplierSignupSuccess &&
        buyerLoginSuccess && supplierLoginSuccess;

    if (allTestsPassed) {
        console.log('\n🎉 All authentication tests passed!');

        // Cleanup test users after successful testing
        console.log('\n🧹 Cleaning up test users...');
        await cleanupTestUser(testUsers.buyer.email);
        await cleanupTestUser(testUsers.supplier.email);
        console.log('✅ Test cleanup completed');
    } else {
        console.log('\n❌ Some authentication tests failed. Check the output above.');
    }
}

// Run tests if this file is executed directly
if (require.main === module) {
    runTests().catch(console.error);
}

module.exports = {
    testSignup,
    testLogin,
    testProtectedEndpoint,
    testUnauthenticatedAccess,
    testSessionEndpoint,
    runTests
}; 