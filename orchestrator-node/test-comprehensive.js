#!/usr/bin/env node

/**
 * Comprehensive Post-Purchase Agent Test Suite
 * PowerShell-friendly version using Node.js
 */

const http = require('http');
const fs = require('fs');

const BASE_URL = 'http://localhost:5000';
const CUSTOMER_ID = 'CUST001';

// Test cases
const testCases = [
    {
        name: '✅ Health Check',
        endpoint: '/post-purchase/health',
        method: 'GET',
        body: null,
        expectedStatus: 200
    },
    {
        name: '✅ Check Order Status',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'check_order_status',
            order_id: 'ORD001'
        },
        expectedStatus: 200
    },
    {
        name: '✅ Track Shipment',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'track_shipment',
            order_id: 'ORD001'
        },
        expectedStatus: 200
    },
    {
        name: '✅ Get Available Returns',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'get_available_returns'
        },
        expectedStatus: 200
    },
    {
        name: '✅ Get Loyalty Points',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'get_loyalty_points'
        },
        expectedStatus: 200
    },
    {
        name: '✅ Get Return History',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'get_return_history'
        },
        expectedStatus: 200
    },
    {
        name: '✅ Initiate Return',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'initiate_return',
            order_id: 'ORD001',
            params: { reason: 'Wrong size' }
        },
        expectedStatus: 200
    },
    {
        name: '✅ Submit Feedback',
        endpoint: '/post-purchase',
        method: 'POST',
        body: {
            customer_id: CUSTOMER_ID,
            action: 'submit_feedback',
            order_id: 'ORD001',
            params: {
                rating: 5,
                comment: 'Great product!',
                recommend: true
            }
        },
        expectedStatus: 200
    }
];

function makeRequest(testCase) {
    return new Promise((resolve, reject) => {
        const url = new URL(testCase.endpoint, BASE_URL);
        
        const options = {
            hostname: url.hostname,
            port: url.port || 80,
            path: url.pathname,
            method: testCase.method,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 5000
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: parsed,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers,
                        parseError: e.message
                    });
                }
            });
        });

        req.on('error', reject);
        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Request timeout after 5000ms'));
        });

        if (testCase.body) {
            req.write(JSON.stringify(testCase.body));
        }
        req.end();
    });
}

async function runTests() {
    console.log('\n' + '═'.repeat(70));
    console.log('  🛍️  POST-PURCHASE AGENT - COMPREHENSIVE TEST SUITE');
    console.log('═'.repeat(70));
    console.log(`\nBase URL: ${BASE_URL}`);
    console.log(`Customer: ${CUSTOMER_ID}`);
    console.log(`Total Tests: ${testCases.length}\n`);

    let passed = 0;
    let failed = 0;
    const results = [];

    for (const testCase of testCases) {
        try {
            console.log(`Testing: ${testCase.name}`);
            process.stdout.write('   Sending request... ');
            
            const result = await makeRequest(testCase);
            
            const statusOK = result.status >= 200 && result.status < 300;
            
            if (statusOK) {
                console.log(`✓ Status ${result.status}`);
                console.log(`   ├─ Response: ${JSON.stringify(result.data).substring(0, 80)}...`);
                passed++;
                results.push({ test: testCase.name, status: 'PASS' });
            } else {
                console.log(`✗ Status ${result.status} (Expected: ${testCase.expectedStatus})`);
                console.log(`   ├─ Response: ${JSON.stringify(result.data)}`);
                failed++;
                results.push({ test: testCase.name, status: 'FAIL', reason: `Status ${result.status}` });
            }
        } catch (error) {
            console.log(`✗ Error: ${error.message}`);
            failed++;
            results.push({ test: testCase.name, status: 'ERROR', reason: error.message });
        }
        console.log();
    }

    // Print summary
    console.log('═'.repeat(70));
    console.log('  TEST SUMMARY');
    console.log('═'.repeat(70));
    console.log(`\n  Total: ${testCases.length} tests`);
    console.log(`  ✓ Passed: ${passed}`);
    console.log(`  ✗ Failed: ${failed}`);
    
    const passRate = Math.round((passed / testCases.length) * 100);
    console.log(`  Success Rate: ${passRate}%\n`);

    if (failed === 0) {
        console.log('  🎉 ALL TESTS PASSED! System is working correctly.\n');
    } else {
        console.log(`  ⚠️  ${failed} test(s) failed. Review errors above.\n`);
    }

    console.log('═'.repeat(70) + '\n');

    // Print detailed results table
    console.log('  DETAILED RESULTS:');
    console.log('  ├─' + '─'.repeat(65));
    results.forEach((r, i) => {
        const status = r.status === 'PASS' ? '✅' : '❌';
        const testName = r.test.substring(0, 45).padEnd(45);
        console.log(`  │ ${i + 1}. ${status} ${testName} ${r.status}`);
        if (r.reason) {
            console.log(`  │    └─ ${r.reason}`);
        }
    });
    console.log('  └─' + '─'.repeat(65) + '\n');

    process.exit(failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    console.error('\n❌ Test suite error:', error);
    process.exit(1);
});
