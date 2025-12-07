#!/usr/bin/env node

const http = require('http');

const BASE_URL = 'http://localhost:5000';

console.log('Testing POST-Purchase Agent...\n');

// Test 1: Health Check
const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/post-purchase/health',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
};

console.log(`Attempting to connect to ${BASE_URL}...`);
console.log(`Options:`, JSON.stringify(options, null, 2));

const req = http.request(options, (res) => {
    console.log(`\n✅ Connected! Status: ${res.statusCode}`);
    
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Response:', data);
        try {
            const json = JSON.parse(data);
            console.log('Parsed JSON:', JSON.stringify(json, null, 2));
        } catch (e) {
            console.log('Could not parse as JSON');
        }
    });
});

req.on('error', (error) => {
    console.error(`❌ Error: ${error.message}`);
    console.error(`Error Code: ${error.code}`);
    console.error(`Error Details:`, error);
});

req.on('timeout', () => {
    console.error('❌ Request timeout after 5000ms');
    req.destroy();
});

req.setTimeout(5000);
req.end();
