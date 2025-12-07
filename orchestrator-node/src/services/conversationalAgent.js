const axios = require('axios');
const logger = require('../utils/logger');

class ConversationalAgent {
    constructor() {
        this.recommendationAPI = process.env.RECOMMENDATION_API || 'http://localhost:8000';
        this.conversations = new Map(); // Store conversation context
    }

    // Natural language patterns for sales interactions
    salesPatterns = {
        greeting: /hello|hi|hey|good (morning|afternoon|evening)|thanks|thankyou/i,
        asking_help: /help|assist|recommend|suggest|find|search|looking for/i,
        price_interest: /price|cost|how much|expensive|cheap|budget|discount|offer|sale/i,
        availability: /available|stock|in stock|out of stock|how many|quantity/i,
        product_interest: /product|item|thing|brand|model|type|category/i,
        purchase_intent: /buy|purchase|checkout|order|add to cart|proceed/i,
        tracking: /track|delivery|status|order status|shipment|where is/i,
        return_interest: /return|exchange|refund|replace|cancel|problem|issue/i,
        farewell: /bye|goodbye|exit|quit|thanks|thank you|see you/i
    };

    // Sales agent responses
    responses = {
        greeting_response: "🎉 Welcome to Retail-Genie! I'm your AI shopping assistant. How can I help you today? Are you looking for something specific?",
        
        help_response: "I'm here to help you find exactly what you need! I can:\n✅ Search for products\n✅ Show you prices and availability\n✅ Track your orders\n✅ Help with returns\n✅ Suggest recommendations\n\nWhat can I assist you with?",
        
        price_inquiry: "Great question! I can help you find the best prices. What product are you interested in? I can show you:\n💰 Current prices\n🎁 Active discounts\n📍 Nearby store availability\n🏷️ Price comparisons",
        
        availability_check: "Let me check the availability for you! What product would you like me to look up? I can:\n📍 Check nearby stores\n⏱️ Provide instant stock status\n🚚 Estimate delivery time",
        
        recommendation_request: "Perfect! Let me suggest some products based on your preferences. Can you tell me:\n🔍 What category interests you?\n💭 What's your budget?\n⭐ Any specific features you want?",
        
        purchase_ready: "Excellent choice! I can help you complete your purchase. Let me verify:\n📦 Product details\n💳 Delivery address\n🎁 Available offers\n\nReady to checkout?",
        
        tracking_help: "I'll help you track your order! Please provide:\n📋 Your order number or\n📧 Your email address\n\nI can show you real-time tracking details!",
        
        return_help: "No problem! I can help with returns, exchanges, and refunds. Tell me:\n🆔 Your order number\n❓ What's the issue?\n✨ What would you like to do?\n\nWe have a 30-day return policy!",
        
        farewell_response: "Thank you for shopping with Retail-Genie! 👋\n⭐ Rate your experience\n💬 Any feedback?\n🔖 Save your favorites\n\nCome back soon!"
    };

    // Detect user intent
    detectIntent(message) {
        const msg = message.toLowerCase();
        
        for (const [intent, pattern] of Object.entries(this.salesPatterns)) {
            if (pattern.test(msg)) {
                return intent;
            }
        }
        
        return 'general_query';
    }

    // Extract product search query
    extractSearchQuery(message) {
        const removeWords = /looking for|search for|find me|show me|i want|i need|can i get|do you have/i;
        return message.replace(removeWords, '').trim();
    }

    // Generate conversational response
    generateResponse(intent, message, userProfile = null) {
        let response = '';

        switch (intent) {
            case 'greeting':
                response = this.responses.greeting_response;
                break;
            case 'asking_help':
                response = this.responses.help_response;
                break;
            case 'price_interest':
                response = this.responses.price_inquiry;
                break;
            case 'availability':
                response = this.responses.availability_check;
                break;
            case 'product_interest':
                response = this.responses.recommendation_request;
                break;
            case 'purchase_intent':
                response = this.responses.purchase_ready;
                break;
            case 'tracking':
                response = this.responses.tracking_help;
                break;
            case 'return_interest':
                response = this.responses.return_help;
                break;
            case 'farewell':
                response = this.responses.farewell_response;
                break;
            default:
                response = `Thanks for your interest! I understood: "${this.extractSearchQuery(message)}"\n\nLet me search for the best matches. What would you like to know about these products?\n💰 Price\n📍 Availability\n⭐ Reviews`;
        }

        return response;
    }

    // Enhance message with context
    async enhanceWithContext(userId, message, sessionId) {
        try {
            // Store conversation in memory for context
            if (!this.conversations.has(userId)) {
                this.conversations.set(userId, []);
            }

            const conversation = this.conversations.get(userId);
            conversation.push({ role: 'user', message, timestamp: new Date() });

            // Keep only last 10 messages for context
            if (conversation.length > 10) {
                conversation.shift();
            }

            return conversation;
        } catch (error) {
            logger.error(`[ConversationalAgent] Context enhancement failed: ${error.message}`);
            return [];
        }
    }

    // Format product recommendations for conversational display
    formatRecommendations(products) {
        if (!products || products.length === 0) {
            return "I couldn't find matching products. Let me suggest some popular items instead! 🎯";
        }

        let formatted = "🎯 Here are the best matches I found:\n\n";
        
        products.slice(0, 5).forEach((product, index) => {
            formatted += `${index + 1}. **${product.name}**\n`;
            formatted += `   💰 Price: ₹${product.price}\n`;
            formatted += `   ⭐ Rating: ${product.rating || 'N/A'}\n`;
            formatted += `   📍 Available: ${product.stock > 0 ? '✅ Yes' : '❌ Out of Stock'}\n\n`;
        });

        formatted += "Would you like more details about any of these? 👆";
        return formatted;
    }

    // Format order tracking info
    formatOrderTracking(orderInfo) {
        if (!orderInfo) {
            return "I couldn't find your order. Please check your order number.";
        }

        let formatted = `📦 **Order Tracking**\n\n`;
        formatted += `Order ID: ${orderInfo.orderId}\n`;
        formatted += `Status: ${orderInfo.status}\n`;
        formatted += `📍 Current Location: ${orderInfo.currentLocation || 'In transit'}\n`;
        formatted += `🕐 Last Update: ${orderInfo.lastUpdate || 'N/A'}\n`;
        formatted += `📅 Estimated Delivery: ${orderInfo.estimatedDelivery || 'N/A'}\n\n`;
        formatted += `📞 Need help? We're here for you! Reply with 'help' anytime.`;
        
        return formatted;
    }

    // Create personalized greeting
    getPersonalizedGreeting(userProfile) {
        if (!userProfile) {
            return this.responses.greeting_response;
        }

        const loyaltyEmoji = {
            'bronze': '🥉',
            'silver': '🥈',
            'gold': '🥇'
        };

        const tier = userProfile.tier || 'bronze';
        const emoji = loyaltyEmoji[tier] || '⭐';

        return `Welcome back, ${userProfile.name}! ${emoji}\n\nYou're a ${tier.toUpperCase()} member with ${userProfile.loyaltyPoints || 0} loyalty points.\n\n${this.responses.greeting_response}`;
    }

    // Clear conversation history
    clearHistory(userId) {
        this.conversations.delete(userId);
        logger.info(`[ConversationalAgent] Conversation history cleared for user: ${userId}`);
    }
}

module.exports = ConversationalAgent;
