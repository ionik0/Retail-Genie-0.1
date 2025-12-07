require("dotenv").config();

module.exports = {
    PORT: process.env.PORT || 5000,
    RECOMMENDER_URL: process.env.RECOMMENDER_URL || "http://localhost:8000/recommend",
    MONGO_URI: process.env.MONGO_URI || "",
    DB_NAME: process.env.DB_NAME || "omnisell",

    // AI Configuration - Hugging Face Inference API
    HF_API_KEY: process.env.HF_API_KEY || "",

    // Local DeepSeek Fallback (optional)
    USE_LOCAL_DEEPSEEK: process.env.USE_LOCAL_DEEPSEEK === "true",
    DEEPSEEK_URL: process.env.DEEPSEEK_URL || "http://localhost:8001",

    // AI Model Settings
    AI_ENABLED: process.env.AI_ENABLED !== "false", // Default: enabled
    AI_MODEL: process.env.AI_MODEL || "deepseek-ai/deepseek-7b-chat",
    AI_TEMPERATURE: parseFloat(process.env.AI_TEMPERATURE) || 0.7,
    AI_MAX_TOKENS: parseInt(process.env.AI_MAX_TOKENS) || 500,
};
