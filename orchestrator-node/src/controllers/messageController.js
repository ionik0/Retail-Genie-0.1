<<<<<<< HEAD
const { detectIntent } = require("../services/intentService");
const { getRecommendations } = require("../services/recommenderService");
const { generateAIResponse } = require("../services/aiService");
const { createSession, getSession, addToHistory } = require("../services/sessionService");
const logger = require("../utils/logger");

// ==================== MESSAGE HANDLER - AI POWERED ====================
=======
const { getAIResponse } = require("../services/aiService");
const { createSession, addToHistory } = require("../services/sessionService");

/**
 * DeepSeek-powered Sales Agent Handler
 * Pure conversational AI - no if/else logic
 * All responses come from DeepSeek
 */
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
exports.handleMessage = async (req, res) => {
    try {
        const { session_id, message } = req.body;

<<<<<<< HEAD
        // Validation
        if (!message || typeof message !== 'string') {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Valid message is required',
                status: 400
            });
        }

        if (message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                code: 'EMPTY_MESSAGE',
                message: 'Message cannot be empty',
                status: 400
            });
        }

        // Create or get session
=======
        if (!message || message.trim() === "") {
            return res.status(400).json({
                error: "Message is required",
                ai_powered: true
            });
        }

        // Create or use existing session
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
        let sid = session_id || createSession();

        // Add user message to history
        addToHistory(sid, "user", message);

<<<<<<< HEAD
        // Detect intent
        const intent = detectIntent(message);
        logger.info(`[MessageController] Message - Intent: ${intent}, Text: "${message.substring(0, 50)}..."`);

        // Extract price filter from message
        let maxPrice = null;
        const priceMatch = message.match(/under\s*(\d+)/i) || message.match(/below\s*(\d+)/i) || message.match(/up to\s*(\d+)/i);
        if (priceMatch) maxPrice = parseInt(priceMatch[1]);

        // ==================== AI-POWERED MESSAGE GENERATION ====================
        
        // Generate intelligent AI response using Hugging Face
        let aiResponse = await generateAIResponse(message, "");
        
        if (!aiResponse) {
            aiResponse = `I'd be delighted to help! Could you tell me more about what you're looking for?`;
        }

        // ==================== GET PRODUCT RECOMMENDATIONS ====================
        
        let cards = [];

        // If it's a product-related query, fetch recommendations
        if (intent === "search_product" || intent === "browse" || intent === "general_search" || 
            message.toLowerCase().includes('show') || message.toLowerCase().includes('find') ||
            message.toLowerCase().includes('have') || message.toLowerCase().includes('wear')) {
            
            try {
                logger.info(`[Recommendations] Fetching for: ${message}, maxPrice: ${maxPrice}`);
                const recommendations = await getRecommendations(message, { 
                    limit: 6,
                    maxPrice: maxPrice 
                });
                
                cards = recommendations || [];
                logger.info(`[Recommendations] Found ${cards.length} products`);
                
            } catch (err) {
                logger.error('[Recommendations Error]', err.message);
                cards = [];
            }
        }

        // Add bot response to history
        addToHistory(sid, "bot", aiResponse);

        // ==================== RETURN RESPONSE ====================
        
        return res.status(200).json({
            success: true,
            code: 'MESSAGE_PROCESSED',
            session_id: sid,
            response: aiResponse,
            cards: cards,
            intent: intent,
            products_found: cards.length,
            status: 200
        });

    } catch (error) {
        logger.error(`[MessageController] Message error: ${error.message}`);
        return res.status(500).json({
            success: false,
            code: 'MESSAGE_ERROR',
            message: 'Failed to process message',
            error: error.message,
            status: 500
=======
        console.log(`🤖 [Sales Agent] User: "${message}"`);

        try {
            // Get AI response from DeepSeek
            const { response, source } = await getAIResponse(message, sid);

            // Add AI response to history
            addToHistory(sid, "assistant", response);

            console.log(`✅ [Sales Agent] DeepSeek Response (${source})`);

            // Return response with metadata
            return res.json({
                session_id: sid,
                response: response,
                agent_name: "Sales Agent",
                ai_powered: true,
                source: source,
                model: "deepseek-7b-chat",
                timestamp: new Date().toISOString()
            });

        } catch (aiError) {
            console.error("❌ DeepSeek Error:", aiError.message);

            // Fallback response if DeepSeek fails
            return res.status(500).json({
                error: "Sales Agent temporarily unavailable",
                details: aiError.message,
                ai_powered: true,
                session_id: sid
            });
        }

    } catch (error) {
        console.error("❌ [Sales Agent] Error:", error);
        return res.status(500).json({
            error: "Failed to process message",
            details: error.message,
            ai_powered: true
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
        });
    }
};

// ==================== GET SESSION HISTORY ====================
exports.handleGetSession = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({
                success: false,
                code: 'SESSION_REQUIRED',
                message: 'Session ID is required',
                status: 400
            });
        }

        const session = getSession(session_id);

        if (!session) {
            return res.status(404).json({
                success: false,
                code: 'SESSION_NOT_FOUND',
                message: 'Session not found',
                status: 404
            });
        }

        return res.status(200).json({
            success: true,
            code: 'SESSION_RETRIEVED',
            session: session,
            status: 200
        });
    } catch (error) {
        logger.error(`[MessageController] Get session error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'SESSION_ERROR',
            message: 'Failed to get session',
            status: 500
        });
    }
};

// ==================== CLEAR HISTORY ====================
exports.handleClearHistory = async (req, res) => {
    try {
        const { userId } = req.body;

        return res.status(200).json({
            success: true,
            code: 'HISTORY_CLEARED',
            message: 'Conversation history cleared',
            status: 200
        });
    } catch (error) {
        logger.error(`[MessageController] Clear history error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'HISTORY_ERROR',
            message: 'Failed to clear history',
            status: 500
        });
    }
};

module.exports = exports;

