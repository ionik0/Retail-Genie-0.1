#!/usr/bin/env node

/**
 * Post-Purchase Agent Test Script
 * Tests all post-purchase functionality
 */

const http = require('http');

const BASE_URL = 'http://localhost:5000';
const CUSTOMER_ID = 'CUST001';

const testCases = [
    {
        name: 'Health Check',
        endpoint: '/post-purchase/health',
        method: 'GET',
        body: null
    },
    {
        name: 'Check Order Status',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'check_order_status',
            order_id: 'ORD001'
        }
    },
    {
        name: 'Track Shipment',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'track_shipment',
            order_id: 'ORD001'
        }
    },
    {
        name: 'Get Available Returns',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'get_available_returns'
        }
    },
    {
        name: 'Submit Feedback',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'submit_feedback',
            order_id: 'ORD001',
            params: {
                rating: 5,
                comment: 'Excellent product and fast delivery!',
                recommend: true
            }
        }
    },
    {
        name: 'Get Loyalty Points',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'get_loyalty_points'
        }
    },
    {
        name: 'Get Return History',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'get_return_history'
        }
    },
    {
        name: 'Initiate Return',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'initiate_return',
            order_id: 'ORD002',
            params: {
                reason: 'Size doesn\'t fit'
            }
        }
    }
];

function makeRequest(testCase) {
    return new Promise((resolve, reject) => {
        const url = new URL(BASE_URL + testCase.endpoint);
        
        const options = {
            hostname: url.hostname,
            port: url.port,
            path: url.pathname,
            method: testCase.method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: parsed
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });

        if (testCase.body) {
            req.write(JSON.stringify(testCase.body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('\n' + '='.repeat(60));
    console.log('  POST-PURCHASE AGENT TEST SUITE');
    console.log('='.repeat(60) + '\n');

    let passed = 0;
    let failed = 0;

    for (const testCase of testCases) {
        try {
            console.log(`🧪 Testing: ${testCase.name}`);
            const result = await makeRequest(testCase);
            
            if (result.status >= 200 && result.status < 300) {
                console.log(`   ✅ Status: ${result.status} OK`);
                console.log(`   Response: ${JSON.stringify(result.data, null, 2).substring(0, 150)}...`);
                passed++;
            } else {
                console.log(`   ❌ Status: ${result.status}`);
                console.log(`   Error: ${JSON.stringify(result.data)}`);
                failed++;
            }
        } catch (error) {
            console.log(`   ❌ Error: ${error.message}`);
            failed++;
        }
        console.log();
    }

    console.log('='.repeat(60));
    console.log(`  TEST RESULTS: ${passed} passed, ${failed} failed`);
    console.log('='.repeat(60) + '\n');

    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    console.error('Test suite error:', error);
    process.exit(1);
});
