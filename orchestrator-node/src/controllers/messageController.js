const { getAIResponse } = require("../services/aiService");
const { createSession, addToHistory } = require("../services/sessionService");

/**
 * DeepSeek-powered Sales Agent Handler
 * Pure conversational AI - no if/else logic
 * All responses come from DeepSeek
 */
exports.handleMessage = async (req, res) => {
    try {
        const { session_id, message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({
                error: "Message is required",
                ai_powered: true
            });
        }

        // Create or use existing session
        let sid = session_id || createSession();

        // Add user message to history
        addToHistory(sid, "user", message);

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
        });
    }
};

