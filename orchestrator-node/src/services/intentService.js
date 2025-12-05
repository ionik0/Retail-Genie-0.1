exports.detectIntent = (text) => {
    const t = text.toLowerCase();

    // Greetings & conversation
    if (/(hello|hi|hey|greetings|how are you|good morning|good afternoon|good evening)/i.test(t)) {
        return "greeting";
    }

    // Help requests
    if (/(help|support|assistant|what can you do|how can you help|tell me more)/i.test(t)) {
        return "help";
    }

    // Cart & checkout
    if (/(add to cart|add|cart|checkout|buy|purchase|order)/i.test(t)) {
        return "cart";
    }

    // Offers & discounts
    if (/(offer|coupon|discount|deal|sale|promotion)/i.test(t)) {
        return "offers";
    }

    // Category browsing
    if (/(show me|browse|categories|what do you have|products|items)/i.test(t)) {
        return "browse";
    }

    // Product info
    if (/(about|details|description|specifications|specs|info|information)/i.test(t)) {
        return "info";
    }

    // Default: product recommendation
    return "recommend";
};
