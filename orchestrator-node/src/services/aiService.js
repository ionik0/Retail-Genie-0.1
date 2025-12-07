// AI Service - Hugging Face LLM Integration with DeepSeek Fallback
// Replaces regex-based intent detection with true LLM-powered conversation

const axios = require("axios");
const { HF_API_KEY, USE_LOCAL_DEEPSEEK, DEEPSEEK_URL } = require("../config/env");

// Mock mode for testing without external APIs
const MOCK_MODE = process.env.AI_MOCK_MODE === "true" || !HF_API_KEY;

// System prompt for ABFRL retail sales agent
const SYSTEM_PROMPT = `You are an expert sales agent for ABFRL (Aditya Birla Fashion and Retail Limited), a premium Indian fashion retail company. You are helpful, professional, and focused on converting customers.

Your responsibilities:
1. Understand customer needs and recommend appropriate fashion products
2. Provide product information, pricing, and availability
3. Help customers with sizing, materials, and styling advice
4. Assist with checkout and promotional offers
5. Answer questions about orders, returns, and customer service

Guidelines:
- Be concise but warm and engaging
- Always try to understand what the customer is looking for
- Make personalized recommendations based on context
- When customers ask about products, provide details on style, fit, price range, and seasonal appropriateness
- Guide customers toward checkout when they show purchase intent
- Be honest about product limitations
- If unsure, offer to connect with support

Format: Respond naturally as a sales agent. When recommending products, include specific details.`;

// Conversation history for context (simplified - can be enhanced with sessionService)
const conversationHistory = new Map();

/**
 * Call Hugging Face Inference API
 */
async function callHuggingFaceAPI(messages) {
    if (!HF_API_KEY) {
        throw new Error("Hugging Face API key not configured. Set HF_API_KEY in environment.");
    }

    try {
        const response = await axios.post(
            "https://api-inference.huggingface.co/models/deepseek-ai/deepseek-7b-chat",
            {
                inputs: formatMessagesForHF(messages),
            },
            {
                headers: {
                    Authorization: `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
                timeout: 30000,
            }
        );

        if (Array.isArray(response.data) && response.data[0]?.generated_text) {
            return response.data[0].generated_text;
        }

        throw new Error("Unexpected response format from Hugging Face API");
    } catch (error) {
        console.error(
            "❌ Hugging Face API error:",
            error.response?.status,
            error.response?.data?.error || error.message
        );
        throw error;
    }
}

/**
 * Call Local DeepSeek (fallback)
 */
async function callLocalDeepSeek(messages) {
    if (!DEEPSEEK_URL) {
        throw new Error("Local DeepSeek URL not configured. Set DEEPSEEK_URL in environment.");
    }

    try {
        const response = await axios.post(
            `${DEEPSEEK_URL}/v1/chat/completions`,
            {
                model: "deepseek-chat",
                messages: messages,
                temperature: 0.7,
                max_tokens: 500,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
                timeout: 15000,
            }
        );

        if (response.data?.choices?.[0]?.message?.content) {
            return response.data.choices[0].message.content;
        }

        throw new Error("Unexpected response format from Local DeepSeek");
    } catch (error) {
        console.error(
            "❌ Local DeepSeek error:",
            error.response?.status,
            error.response?.data?.error || error.message
        );
        throw error;
    }
}

/**
 * Mock AI response generator for testing/demo (when no API key available)
 */
function generateMockResponse(userMessage) {
    const lowerMsg = userMessage.toLowerCase();

    // Mock responses that simulate DeepSeek sales agent behavior
    const responses = {
        greeting: [
            "Hello! Welcome to ABFRL Fashion! I'm your personal sales agent. I'm here to help you find the perfect fashion items. What are you looking for today?",
            "Hi there! 👋 Great to see you! I'm your sales agent at ABFRL. Whether you're looking for casual wear, formal attire, or accessories, I've got you covered. What catches your interest?",
            "Welcome! I'm delighted to assist you. At ABFRL, we offer premium fashion across all categories. Tell me about your style preferences and I'll find something perfect for you!"
        ],
        help: [
            "I can help you with:\n• Finding specific fashion items (clothing, accessories, footwear)\n• Getting product recommendations based on your style and budget\n• Checking current offers and promotions\n• Answering questions about sizing, materials, and care\n• Assisting with checkout and order information\n\nWhat would you like help with?",
            "Great question! Here's what I can do:\n✓ Search for products by category, price, or occasion\n✓ Recommend items based on your preferences\n✓ Share details about current deals\n✓ Help with size guides and styling advice\n✓ Guide you through checkout\n\nHow can I assist?",
            "I'm here to make your shopping experience seamless! I can:\n• Help you discover fashion pieces that match your style\n• Show you trending items and bestsellers\n• Explain product details like fabric, fit, and care instructions\n• Guide you toward perfect outfits for any occasion\n\nWhat interests you?"
        ],
        products: [
            "Excellent choice! ABFRL has a fantastic collection. Are you looking for:\n• Casual wear (shirts, jeans, t-shirts)?\n• Formal attire (suits, blazers, formal dresses)?\n• Seasonal items (winter jackets, summer dresses)?\n• Accessories (belts, ties, scarves)?\n• Footwear (shoes, sandals, boots)?\n\nLet me know and I'll find the perfect pieces for you!",
            "Great! We have an amazing range. To help you better, tell me:\n• What's the occasion? (work, casual, special event)\n• What's your budget range?\n• Any color or style preferences?\n\nI'll recommend items that are perfect for you!",
            "Perfect! I'd love to help you find exactly what you need. Are you shopping for yourself or someone else? And what's your preferred style - classic, trendy, or comfortable casual?"
        ],
        offers: [
            "🎉 Exciting news! We currently have several amazing offers:\n• 20% off on select casual wear\n• Buy 2 get 1 free on accessories\n• Premium collection - 15% off\n• Free shipping on orders over ₹1,000\n\nWould you like me to show you items that qualify for these offers?",
            "We have wonderful promotions running! Here are some highlights:\n✓ Seasonal sale on winter collection - up to 30% off\n✓ Flash deals on trending items\n✓ Loyalty rewards for returning customers\n✓ Special bundle packages\n\nWhat category interests you?",
            "Great timing! Our current offers include:\n• Clearance items up to 40% off\n• New arrivals - special introductory pricing\n• Member exclusive deals\n• Gift bundles with special pricing\n\nShall I show you these deals?"
        ],
        formal: [
            "Excellent! Our formal wear collection is stunning. For men, we have:\n• Premium suits starting ₹3,500\n• Formal shirts in various fabrics\n• Blazers and waistcoats\n• Formal footwear and accessories\n\nFor women:\n• Elegant sarees and salwar kameez\n• Formal dresses and gowns\n• Dress materials in premium fabrics\n\nWhat's the occasion and your budget?",
            "Perfect! ABFRL's formal collection is exceptional. Whether you need:\n• Business attire for work\n• Wedding guest outfits\n• Party wear\n• Formal celebrations\n\nI can recommend pieces that will make you look absolutely fantastic. What's the occasion?",
            "Great choice! For formal wear, we have:\n• Premium tailored options\n• Designer collaborations\n• Occasion-specific pieces\n• Classic and contemporary styles\n\nTell me more about the event and your style, and I'll find the perfect outfit!"
        ],
        casual: [
            "Love casual wear! We have everything you need:\n• Comfortable t-shirts and casual shirts\n• Trendy jeans and casual trousers\n• Relaxed fit dresses\n• Comfortable footwear\n• Casual jackets and hoodies\n\nWhat's your style - minimalist, trendy, or classic casual?",
            "Casual wear is my favorite! We offer:\n• All-day comfortable basics\n• Trendy casual pieces\n• Weekend wear collections\n• Seasonal casual items\n• Mix-and-match essentials\n\nWhat occasion? (everyday wear, weekend outing, relaxing at home)",
            "Perfect! Our casual collection is amazing for:\n• Everyday comfort\n• Weekend adventures\n• Casual social gatherings\n• Work-from-home comfort\n\nWhat's your preferred vibe - sporty, chic, or super relaxed?"
        ],
        default: [
            "That's an interesting choice! Let me help you find exactly what you're looking for. Could you tell me a bit more about your preferences? For example:\n• What type of clothing?\n• What's your budget?\n• Any color preferences?\n\nThis will help me make the best recommendation!",
            "Great question! I'd love to help. To give you the perfect recommendation:\n• What's the occasion or purpose?\n• What's your style preference?\n• Do you have a budget in mind?\n\nWith these details, I can find something perfect for you!",
            "Absolutely! Let me assist you better. Could you share:\n• What you're looking for specifically\n• Your style preferences\n• Your budget range\n\nI'll make sure to find exactly what you need!"
        ]
    };

    // Determine response category
    let category = "default";
    if (lowerMsg.match(/hello|hi|hey|greet/)) category = "greeting";
    else if (lowerMsg.match(/help|what can you do|assist/)) category = "help";
    else if (lowerMsg.match(/formal|suit|blazer|dress|saree/)) category = "formal";
    else if (lowerMsg.match(/casual|comfortable|jeans|t-?shirt|relax/)) category = "casual";
    else if (lowerMsg.match(/offer|deal|discount|promo|sale/)) category = "offers";
    else if (lowerMsg.match(/show|find|recommend|product/)) category = "products";

    // Return random response from category
    const categoryResponses = responses[category];
    return categoryResponses[Math.floor(Math.random() * categoryResponses.length)];
}

/**
 * Format messages for Hugging Face API
 */
function formatMessagesForHF(messages) {
    return messages
        .map(msg => `${msg.role === "system" ? "[SYSTEM]" : msg.role === "user" ? "[USER]" : "[ASSISTANT]"}: ${msg.content}`)
        .join("\n");
}

/**
 * Get AI response with conversation context
 */
exports.getAIResponse = async (userMessage, sessionId = null) => {
    try {
        // Initialize conversation history if needed
        if (sessionId && !conversationHistory.has(sessionId)) {
            conversationHistory.set(sessionId, []);
        }

        const history = sessionId ? conversationHistory.get(sessionId) : [];

        // Build messages array
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            ...history,
            { role: "user", content: userMessage },
        ];

        // Limit history to last 10 exchanges to avoid token limits
        if (messages.length > 22) {
            // Keep system prompt + last 10 exchanges
            messages.splice(1, messages.length - 22);
        }

        let response;
        let source = "huggingface";

        // Try Hugging Face API first
        if (MOCK_MODE) {
            console.log("🤖 [MOCK MODE] Generating AI response...");
            response = generateMockResponse(userMessage);
            source = "mock-deepseek-demo";
        } else if (HF_API_KEY) {
            try {
                console.log("🤖 Calling Hugging Face Inference API...");
                response = await callHuggingFaceAPI(messages);
            } catch (error) {
                console.warn("⚠️ Hugging Face API failed, attempting fallback...");
                if (USE_LOCAL_DEEPSEEK && DEEPSEEK_URL) {
                    console.log("🔄 Falling back to Local DeepSeek...");
                    response = await callLocalDeepSeek(messages);
                    source = "deepseek-local";
                } else {
                    throw error;
                }
            }
        } else if (USE_LOCAL_DEEPSEEK && DEEPSEEK_URL) {
            // Use local DeepSeek if no HF API key
            console.log("🔄 Using Local DeepSeek (no HF API key)...");
            response = await callLocalDeepSeek(messages);
            source = "deepseek-local";
        } else {
            throw new Error(
                "No AI provider configured. Set HF_API_KEY or configure local DeepSeek."
            );
        }

        // Clean response
        const cleanResponse = MOCK_MODE ? response : extractResponseText(response).trim();

        // Update history
        if (sessionId) {
            history.push({ role: "user", content: userMessage });
            history.push({ role: "assistant", content: cleanResponse });
            conversationHistory.set(sessionId, history);
        }

        return {
            response: cleanResponse,
            source: source,
            sessionId: sessionId,
        };
    } catch (error) {
        console.error("❌ AI Service error:", error.message);
        throw error;
    }
};

/**
 * Extract clean response text from LLM output
 */
function extractResponseText(text) {
    // Remove [ASSISTANT]: prefix if present
    let cleaned = text.replace(/^\[ASSISTANT\]:\s*/i, "").trim();

    // Remove markdown code blocks if present
    cleaned = cleaned.replace(/```[\s\S]*?```/g, "").trim();

    // If the text is very long, truncate and add ellipsis
    if (cleaned.length > 1000) {
        cleaned = cleaned.substring(0, 997) + "...";
    }

    return cleaned;
}

/**
 * Detect intent with AI (more sophisticated than regex)
 */
exports.detectIntentWithAI = async (userMessage, sessionId = null) => {
    try {
        const intentPrompt = `Based on this customer message, determine the primary intent. Respond with ONLY one of these: greeting, help, browse, cart, checkout, offers, info, recommend, post_purchase, support

Customer message: "${userMessage}"

Intent:`;

        const messages = [
            {
                role: "system",
                content: "You are a helpful assistant that classifies customer intents. Respond with only the intent name.",
            },
            { role: "user", content: intentPrompt },
        ];

        let response;

        if (HF_API_KEY) {
            try {
                response = await callHuggingFaceAPI(messages);
            } catch (error) {
                if (USE_LOCAL_DEEPSEEK && DEEPSEEK_URL) {
                    response = await callLocalDeepSeek(messages);
                } else {
                    throw error;
                }
            }
        } else if (USE_LOCAL_DEEPSEEK && DEEPSEEK_URL) {
            response = await callLocalDeepSeek(messages);
        }

        const intent = response.toLowerCase().replace(/[^a-z_]/g, "").trim();

        // Validate intent
        const validIntents = [
            "greeting",
            "help",
            "browse",
            "cart",
            "checkout",
            "offers",
            "info",
            "recommend",
            "post_purchase",
            "support",
        ];

        return validIntents.includes(intent) ? intent : "recommend";
    } catch (error) {
        console.warn("⚠️ AI intent detection failed, using default");
        return "recommend";
    }
};

/**
 * Get product-specific sales pitch
 */
exports.getSalesPitch = async (productName, productDetails) => {
    try {
        const pitchPrompt = `Create a short, compelling sales pitch (2-3 sentences) for this ABFRL product. Focus on style, quality, and value.

Product: ${productName}
Details: ${JSON.stringify(productDetails)}

Sales pitch:`;

        const messages = [
            {
                role: "system",
                content:
                    "You are an expert fashion sales consultant for ABFRL. Create compelling, concise product pitches.",
            },
            { role: "user", content: pitchPrompt },
        ];

        let response;

        if (HF_API_KEY) {
            try {
                response = await callHuggingFaceAPI(messages);
            } catch (error) {
                if (USE_LOCAL_DEEPSEEK && DEEPSEEK_URL) {
                    response = await callLocalDeepSeek(messages);
                } else {
                    throw error;
                }
            }
        } else if (USE_LOCAL_DEEPSEEK && DEEPSEEK_URL) {
            response = await callLocalDeepSeek(messages);
        }

        return extractResponseText(response).trim();
    } catch (error) {
        console.warn("⚠️ Failed to generate sales pitch:", error.message);
        return `Check out this great ${productName} from ABFRL - perfect for your style!`;
    }
};

/**
 * Clear conversation history (useful for session cleanup)
 */
exports.clearHistory = (sessionId) => {
    if (sessionId) {
        conversationHistory.delete(sessionId);
    }
};

/**
 * Get conversation history length (for monitoring)
 */
exports.getHistoryLength = (sessionId) => {
    return sessionId ? conversationHistory.get(sessionId)?.length || 0 : 0;
};
