const { detectIntent } = require("../services/intentService");
const { getRecommendations } = require("../services/recommenderService");
const { getApplicableOffers } = require("../services/offerService");
const { createSession, getSession, addToHistory } = require("../services/sessionService");

const greetingResponses = [
    "Hello! Welcome to OmniSell. I'm your personal shopping assistant. How can I help you today?",
    "Hi there! 👋 Looking for something special? I can help you find the perfect products!",
    "Hey! Great to see you. What are you in the mood for today?",
    "Welcome! I'm here to help you shop. What would you like?"
];

const helpResponses = [
    "I'm your AI shopping assistant! I can:\n• Recommend products based on what you're looking for\n• Show you current offers and discounts\n• Help you add items to cart\n• Answer product questions\nJust tell me what you need!",
    "I can help you with:\n✓ Finding products (just describe what you want)\n✓ Checking offers and deals\n✓ Product information\n✓ Adding items to cart\nWhat would you like to explore?"
];

const getRandomResponse = (responses) => {
    return responses[Math.floor(Math.random() * responses.length)];
};

exports.handleMessage = async (req, res) => {
    try {
        const { session_id, message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        let sid = session_id || createSession();
        const session = getSession(sid);

        addToHistory(sid, "user", message);

        const intent = detectIntent(message);
        const lowerMsg = message.toLowerCase();

        // Extract price filter if present
        let max_price = null;
        const match = message.match(/under\s*(\d+)/i) || message.match(/below\s*(\d+)/i) || message.match(/up to\s*(\d+)/i);
        if (match) max_price = parseInt(match[1]);

        console.log(`[MessageController] Processing message: "${message}", intent: ${intent}`);

        // Handle greetings
        if (intent === "greeting") {
            addToHistory(sid, "bot", "greeting");
            return res.json({
                session_id: sid,
                response: getRandomResponse(greetingResponses),
                conversational: true
            });
        }

        // Handle help requests
        if (intent === "help") {
            addToHistory(sid, "bot", "help");
            return res.json({
                session_id: sid,
                response: getRandomResponse(helpResponses),
                conversational: true
            });
        }

        // Handle cart
        if (intent === "cart") {
            addToHistory(sid, "bot", "cart");
            return res.json({
                session_id: sid,
                response: "Perfect! Tell me which products you'd like to add, or I can recommend something great for you.",
                conversational: true
            });
        }

        // Handle offers
        if (intent === "offers") {
            const allOffers = getApplicableOffers([]);
            addToHistory(sid, "bot", "sending offers");
            
            return res.json({
                session_id: sid,
                response: allOffers.length > 0 
                    ? "🎉 Great news! Here are our current amazing offers!" 
                    : "No active offers available at the moment. But our prices are already competitive!",
                offers: allOffers || [],
                conversational: true
            });
        }

        // Handle browse request
        if (intent === "browse") {
            // Get a sample of products from different categories
            const sampleProducts = await getRecommendations("show me everything popular items bestsellers", { limit: 8 });
            addToHistory(sid, "bot", "browse");
            
            return res.json({
                session_id: sid,
                response: "Here's a selection of our popular products across categories:",
                cards: sampleProducts || [],
                conversational: true
            });
        }

        // Handle product info (ask for more details)
        if (intent === "info") {
            addToHistory(sid, "bot", "info");
            return res.json({
                session_id: sid,
                response: "I'd be happy to help! Which product would you like to know more about? Or tell me what kind of product interests you.",
                conversational: true
            });
        }

        // Handle recommendations
        if (intent === "recommend") {
            const items = await getRecommendations(message, { max_price });
            const offers = getApplicableOffers(items);

            addToHistory(sid, "bot", "sending recommendations");

            if (items.length > 0) {
                return res.json({
                    session_id: sid,
                    response: `Great! I found ${items.length} perfect options for you! ✨`,
                    cards: items || [],
                    offers: offers || []
                });
            }

            // No items found - provide helpful guidance
            return res.json({
                session_id: sid,
                response: "I couldn't find exact matches, but here are some alternatives. Try asking for:\n• Specific categories (apparel, accessories, electronics, groceries, books)\n• Price range (under 1000, under 5000)\n• Occasion (party wear, formal, casual, wedding wear)\n• Item type (shirts, jeans, shoes, belts, ties, socks, and more!)",
                conversational: true
            });
        }

        // Fallback
        return res.json({ 
            session_id: sid, 
            response: "I'm here to help! You can ask me to:\n• Find specific products or categories\n• Show deals and offers\n• Help with checkout\nWhat would you like to do?",
            conversational: true
        });
    } catch (error) {
        console.error('[MessageController] Error:', error);
        return res.status(500).json({
            error: "Failed to process message",
            details: error.message
        });
    }
};

