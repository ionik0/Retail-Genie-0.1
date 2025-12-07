#!/usr/bin/env node

/**
 * test-ai-integration.js
 * 
 * Tests the Hugging Face AI integration and fallback system
 * Run: node test-ai-integration.js
 */

const axios = require("axios");
require("dotenv").config();

const BASE_URL = "http://localhost:5000";

// Test messages simulating real customer conversations
const testMessages = [
    {
        message: "Hello! Can you help me find something?",
        expectedIntent: "greeting",
        description: "Greeting test"
    },
    {
        message: "What can you do for me?",
        expectedIntent: "help",
        description: "Help request test"
    },
    {
        message: "Show me formal wear for men under 5000",
        expectedIntent: "recommend",
        description: "Product recommendation with price filter"
    },
    {
        message: "What are your current offers?",
        expectedIntent: "offers",
        description: "Offers inquiry"
    },
    {
        message: "Tell me about casual dresses",
        expectedIntent: "info",
        description: "Product info request"
    },
    {
        message: "I want to add this to my cart",
        expectedIntent: "cart",
        description: "Cart action"
    },
    {
        message: "Show me everything you have in summer collection",
        expectedIntent: "browse",
        description: "Browse/category exploration"
    },
    {
        message: "Do you have winter jackets? I'm looking for something stylish and warm",
        expectedIntent: "recommend",
        description: "Complex query with multiple attributes"
    }
];

// Color codes for terminal output
const colors = {
    reset: "\x1b[0m",
    green: "\x1b[32m",
    red: "\x1b[31m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    cyan: "\x1b[36m"
};

const log = {
    success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
    test: (msg) => console.log(`${colors.blue}🧪 ${msg}${colors.reset}`),
    section: (msg) => console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n${msg}\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`)
};

async function checkServerHealth() {
    log.section("🔍 Step 1: Checking Server Health");
    try {
        const response = await axios.get(`${BASE_URL}/`, { timeout: 5000 });
        log.success(`Server is running: ${response.data}`);
        return true;
    } catch (error) {
        log.error(`Server is not running at ${BASE_URL}`);
        log.error(`Make sure to start: cd orchestrator-node && npm start`);
        return false;
    }
}

async function checkAIConfiguration() {
    log.section("⚙️  Step 2: Checking AI Configuration");

    const hfKey = process.env.HF_API_KEY;
    const aiEnabled = process.env.AI_ENABLED !== "false";
    const useLocalDeepSeek = process.env.USE_LOCAL_DEEPSEEK === "true";
    const deepseekUrl = process.env.DEEPSEEK_URL;

    log.info(`AI_ENABLED: ${aiEnabled}`);

    if (aiEnabled) {
        if (hfKey) {
            log.success(`Hugging Face API key configured (${hfKey.substring(0, 10)}...)`);
        } else {
            log.warn("No Hugging Face API key. Set HF_API_KEY in .env");
        }

        if (useLocalDeepSeek) {
            log.info(`Local DeepSeek fallback enabled: ${deepseekUrl}`);
        } else {
            log.info("Local DeepSeek fallback disabled");
        }
    } else {
        log.warn("AI disabled - using legacy regex-based system");
    }

    return aiEnabled;
}

async function testMessage(message, sessionId) {
    try {
        const response = await axios.post(
            `${BASE_URL}/message`,
            { session_id: sessionId, message },
            { timeout: 45000 } // Longer timeout for LLM inference
        );

        return {
            success: true,
            data: response.data,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.error || error.message,
            timestamp: new Date().toISOString()
        };
    }
}

async function runTests() {
    log.section("🧪 Step 3: Running Conversation Tests");

    let sessionId = null;
    let passedTests = 0;
    let failedTests = 0;

    for (let i = 0; i < testMessages.length; i++) {
        const test = testMessages[i];
        log.test(`[${i + 1}/${testMessages.length}] ${test.description}`);
        console.log(`   Message: "${test.message}"`);

        const result = await testMessage(test.message, sessionId);

        if (result.success) {
            const data = result.data;
            sessionId = data.session_id;

            log.success(`Response received (${data.source || "legacy"})`);

            if (data.response) {
                console.log(`   Response: "${data.response.substring(0, 100)}${data.response.length > 100 ? "..." : ""}"`);
            }

            if (data.intent) {
                console.log(`   Intent: ${data.intent} (expected: ${test.expectedIntent})`);
                if (data.intent === test.expectedIntent) {
                    log.success("Intent matched!");
                } else {
                    log.warn("Intent mismatch (LLM may use different classification)");
                }
            }

            if (data.cards?.length > 0) {
                console.log(`   Products found: ${data.cards.length}`);
            }

            if (data.ai_powered !== undefined) {
                const label = data.ai_powered ? "AI-Powered 🤖" : "Legacy System 📋";
                console.log(`   Mode: ${label}`);
            }

            passedTests++;
        } else {
            log.error(`Failed: ${result.error}`);
            failedTests++;
        }

        console.log();
    }

    return { passedTests, failedTests };
}

async function generateReport(serverRunning, aiEnabled, testResults) {
    log.section("📊 Test Report");

    console.log("Configuration:");
    console.log(`  ✓ Server Running: ${serverRunning ? "YES" : "NO"}`);
    console.log(`  ✓ AI Enabled: ${aiEnabled ? "YES" : "NO"}`);
    console.log();

    console.log("Test Results:");
    console.log(`  ✓ Passed: ${testResults.passedTests}/${testMessages.length}`);
    console.log(`  ✗ Failed: ${testResults.failedTests}/${testMessages.length}`);
    console.log();

    const passRate = ((testResults.passedTests / testMessages.length) * 100).toFixed(1);
    console.log(`Overall Success Rate: ${passRate}%`);

    if (passRate === "100") {
        log.success("All tests passed! 🎉");
    } else if (passRate >= 80) {
        log.warn("Most tests passed. Check failures above.");
    } else {
        log.error("Multiple test failures. Review configuration.");
    }
}

async function main() {
    console.log();
    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║     🤖 Retail-Genie AI Integration Test Suite 🤖          ║");
    console.log("║          Hugging Face + DeepSeek Integration              ║");
    console.log("╚════════════════════════════════════════════════════════════╝");
    console.log();

    try {
        // Step 1: Check server health
        const serverRunning = await checkServerHealth();
        if (!serverRunning) {
            log.error("Cannot proceed without running server");
            process.exit(1);
        }

        // Step 2: Check configuration
        const aiEnabled = await checkAIConfiguration();

        // Step 3: Run tests
        const testResults = await runTests();

        // Step 4: Generate report
        await generateReport(serverRunning, aiEnabled, testResults);

        console.log();
        log.section("💡 Next Steps");

        if (testResults.failedTests > 0) {
            console.log("Troubleshooting:");
            console.log("1. Check .env configuration in orchestrator-node/");
            console.log("2. Verify Hugging Face API key: https://huggingface.co/settings/tokens");
            console.log("3. For local DeepSeek: ensure ollama/docker is running");
            console.log("4. Check server logs: npm start");
            console.log();
        }

        console.log("Resources:");
        console.log("  📖 Setup Guide: AI_INTEGRATION_SETUP.md");
        console.log("  🔗 Hugging Face: https://huggingface.co");
        console.log("  🐳 DeepSeek: https://github.com/deepseek-ai/deepseek-llm");
        console.log();

    } catch (error) {
        log.error(`Unexpected error: ${error.message}`);
        console.error(error);
        process.exit(1);
    }
}

// Run tests
main();
