#!/usr/bin/env node

/**
 * Retail-Genie - Comprehensive API Test Suite
 * Tests all endpoints for functionality, error handling, and response format
 * 
 * Run with: node test-all-endpoints.js
 */

const axios = require('axios');

// Configuration
const API_BASE = 'http://localhost:5000';
const TIMEOUT = 5000;

let accessToken = '';
let refreshToken = '';
let userId = '';
let addressId = '';

// Colors for output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m'
};

// Test results
let passed = 0;
let failed = 0;
const failedTests = [];

// Helper functions
const log = (message, color = 'reset') => {
    console.log(`${colors[color]}${message}${colors.reset}`);
};

const logTest = (name, passed, details = '') => {
    const status = passed ? `${colors.green}✅ PASS${colors.reset}` : `${colors.red}❌ FAIL${colors.reset}`;
    console.log(`${status} - ${name}${details ? ` (${details})` : ''}`);
    if (passed) {
        passed++;
    } else {
        failed++;
        failedTests.push(name);
    }
};

const logSection = (title) => {
    console.log(`\n${colors.bright}${colors.cyan}═══════════════════════════════════════${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}${title}${colors.reset}`);
    console.log(`${colors.bright}${colors.cyan}═══════════════════════════════════════${colors.reset}\n`);
};

const testEndpoint = async (name, method, endpoint, data = null, expectedStatus = 200, auth = false) => {
    try {
        const config = {
            method,
            url: `${API_BASE}${endpoint}`,
            timeout: TIMEOUT,
            validateStatus: () => true // Don't throw on any status
        };

        if (data) config.data = data;
        if (auth && accessToken) {
            config.headers = {
                'Authorization': `Bearer ${accessToken}`
            };
        }

        const response = await axios(config);
        
        const statusMatch = response.status === expectedStatus;
        const hasSuccess = response.data.hasOwnProperty('success');
        const passed = statusMatch && hasSuccess;

        logTest(name, passed, `Status: ${response.status}, Has success field: ${hasSuccess}`);

        if (!statusMatch || !hasSuccess) {
            console.log(`  Expected: ${expectedStatus}, Got: ${response.status}`);
            console.log(`  Response: ${JSON.stringify(response.data).substring(0, 100)}`);
        }

        return { passed, response };
    } catch (error) {
        logTest(name, false, `Error: ${error.message}`);
        return { passed: false, response: null };
    }
};

// Test suite
const runTests = async () => {
    try {
        logSection('🚀 RETAIL-GENIE API TEST SUITE');

        // ==================== HEALTH CHECK ====================
        logSection('1️⃣  HEALTH CHECK');
        try {
            const health = await axios.get(`${API_BASE}/`);
            log(`✅ Server is running: ${health.status}`, 'green');
            log(`   Message: ${health.data.message}`, 'blue');
        } catch (error) {
            log(`❌ Server is not running at ${API_BASE}`, 'red');
            log(`   Please start the orchestrator service first:`, 'yellow');
            log(`   cd orchestrator-node && npm start`, 'cyan');
            process.exit(1);
        }

        // ==================== AUTHENTICATION ====================
        logSection('2️⃣  AUTHENTICATION ENDPOINTS');

        // Register
        const registerData = {
            email: `test${Date.now()}@example.com`,
            password: 'TestPass123',
            name: 'Test User',
            phone: '+91-9876543210'
        };
        
        const { response: registerRes } = await testEndpoint(
            'Register new user',
            'POST',
            '/auth/register',
            registerData,
            201
        );

        if (registerRes?.data?.success) {
            userId = registerRes.data.user.id;
            log(`  📝 User ID: ${userId}`, 'blue');
        } else {
            log('  ⚠️  Registration failed, skipping dependent tests', 'yellow');
        }

        // Login
        const loginData = {
            email: registerData.email,
            password: registerData.password
        };

        const { response: loginRes } = await testEndpoint(
            'Login user',
            'POST',
            '/auth/login',
            loginData,
            200
        );

        if (loginRes?.data?.tokens) {
            accessToken = loginRes.data.tokens.accessToken;
            refreshToken = loginRes.data.tokens.refreshToken;
            log(`  🔐 Access Token obtained (${accessToken.substring(0, 20)}...)`, 'blue');
            log(`  🔄 Refresh Token obtained (${refreshToken.substring(0, 20)}...)`, 'blue');
        }

        // Refresh Token
        if (refreshToken) {
            await testEndpoint(
                'Refresh access token',
                'POST',
                '/auth/refresh-token',
                { refreshToken },
                200
            );
        }

        // ==================== PROFILE ENDPOINTS ====================
        if (accessToken) {
            logSection('3️⃣  PROFILE ENDPOINTS');

            // Get Profile
            await testEndpoint(
                'Get user profile',
                'GET',
                '/auth/profile',
                null,
                200,
                true
            );

            // Update Profile
            const updateData = {
                name: 'Updated Name',
                phone: '+91-9876543211',
                profile: {
                    bio: 'Test user'
                }
            };

            await testEndpoint(
                'Update user profile',
                'PUT',
                '/auth/profile',
                updateData,
                200,
                true
            );

            // ==================== ADDRESS MANAGEMENT ====================
            logSection('4️⃣  ADDRESS MANAGEMENT');

            // Get Addresses
            const { response: addressesRes } = await testEndpoint(
                'Get all addresses',
                'GET',
                '/auth/addresses',
                null,
                200,
                true
            );

            // Add Address
            const addressData = {
                street: '123 Main Street',
                city: 'New Delhi',
                state: 'Delhi',
                postalCode: '110001',
                country: 'India',
                phone: '+91-9876543210',
                type: 'home',
                label: 'Home',
                isDefault: true,
                coordinates: {
                    latitude: 28.6139,
                    longitude: 77.2090
                }
            };

            const { response: addAddressRes } = await testEndpoint(
                'Add new address',
                'POST',
                '/auth/addresses',
                addressData,
                201,
                true
            );

            if (addAddressRes?.data?.address?.id) {
                addressId = addAddressRes.data.address.id;
                log(`  📍 Address ID: ${addressId}`, 'blue');
            }

            // Update Address
            if (addressId) {
                await testEndpoint(
                    'Update address',
                    'PUT',
                    `/auth/addresses/${addressId}`,
                    { city: 'Mumbai', state: 'Maharashtra' },
                    200,
                    true
                );
            }

            // ==================== GPS & LOCATION ====================
            logSection('5️⃣  GPS & LOCATION ENDPOINTS');

            // Update GPS
            const gpsData = {
                latitude: 28.6139,
                longitude: 77.2090,
                accuracy: 10,
                address: 'New Delhi, India'
            };

            await testEndpoint(
                'Update GPS location',
                'POST',
                '/location/gps/update',
                gpsData,
                200,
                true
            );

            // Toggle GPS
            await testEndpoint(
                'Toggle GPS mode (enable)',
                'POST',
                '/location/gps/toggle',
                { enabled: true },
                200,
                true
            );

            await testEndpoint(
                'Toggle GPS mode (disable)',
                'POST',
                '/location/gps/toggle',
                { enabled: false },
                200,
                true
            );

            // Get All Stores
            await testEndpoint(
                'Get all stores',
                'GET',
                '/location/stores',
                null,
                200
            );

            // Check Availability
            await testEndpoint(
                'Check product availability',
                'POST',
                '/location/check-availability',
                { storeId: 'STORE001', productIds: ['PROD001'] },
                200
            );

            // ==================== PREFERENCES ====================
            logSection('6️⃣  PREFERENCES ENDPOINTS');

            const prefData = {
                radius: 20,
                sortBy: 'rating',
                notifications: false,
                language: 'en',
                currency: 'INR'
            };

            await testEndpoint(
                'Update preferences',
                'POST',
                '/auth/preferences',
                prefData,
                200,
                true
            );

            // ==================== CHATBOT ====================
            logSection('7️⃣  CHATBOT & SHOPPING ENDPOINTS');

            const msgData = {
                session_id: `SESSION${Date.now()}`,
                message: 'Hello! Show me affordable laptops under 50000',
                userId: userId
            };

            const { response: msgRes } = await testEndpoint(
                'Send chat message (product search)',
                'POST',
                '/message',
                msgData,
                200
            );

            if (msgRes?.data?.products) {
                log(`  🛍️  Found ${msgRes.data.products.length} products`, 'blue');
            }

            // ==================== LOGOUT ====================
            logSection('8️⃣  LOGOUT');

            await testEndpoint(
                'Logout user',
                'POST',
                '/auth/logout',
                { refreshToken },
                200,
                true
            );

            // ==================== DELETE ADDRESS ====================
            if (addressId) {
                logSection('9️⃣  CLEANUP');

                await testEndpoint(
                    'Delete address',
                    'DELETE',
                    `/auth/addresses/${addressId}`,
                    null,
                    200,
                    true
                );
            }
        }

        // ==================== ERROR HANDLING ====================
        logSection('🔟 ERROR HANDLING TESTS');

        // Invalid endpoints
        await testEndpoint(
            '404 - Non-existent endpoint',
            'GET',
            '/invalid/endpoint',
            null,
            404
        );

        // Missing required fields
        await testEndpoint(
            '400 - Missing email in register',
            'POST',
            '/auth/register',
            { password: 'test', name: 'test' },
            400
        );

        // Weak password
        await testEndpoint(
            '400 - Weak password',
            'POST',
            '/auth/register',
            { email: 'test@test.com', password: '123', name: 'test' },
            400
        );

        // Unauthorized access
        await testEndpoint(
            '401 - Missing authentication token',
            'GET',
            '/auth/profile',
            null,
            401
        );

        // ==================== SUMMARY ====================
        logSection('📊 TEST SUMMARY');

        const total = passed + failed;
        const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;

        log(`Total Tests: ${total}`, 'bright');
        log(`✅ Passed: ${passed}`, 'green');
        log(`❌ Failed: ${failed}`, 'red');
        log(`📈 Success Rate: ${percentage}%`, percentage === 100 ? 'green' : percentage >= 80 ? 'yellow' : 'red');

        if (failedTests.length > 0) {
            log(`\nFailed Tests:`, 'red');
            failedTests.forEach(test => log(`  • ${test}`, 'red'));
        }

        logSection('✨ TEST COMPLETE');

        if (percentage === 100) {
            log('🎉 All tests passed! System is production-ready.', 'green');
            process.exit(0);
        } else if (percentage >= 80) {
            log('⚠️  Most tests passed. Please review failures above.', 'yellow');
            process.exit(0);
        } else {
            log('❌ Multiple tests failed. Please fix issues before deployment.', 'red');
            process.exit(1);
        }

    } catch (error) {
        log(`\n❌ Test suite failed: ${error.message}`, 'red');
        process.exit(1);
    }
};

// Run tests
runTests();
