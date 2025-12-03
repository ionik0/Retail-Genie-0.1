exports.detectIntent = (text) => {
    const t = text.toLowerCase();

    if (/(add to cart|add|cart|checkout|buy|purchase)/i.test(t)) return "cart";
    if (/(offer|coupon|discount)/i.test(t)) return "offers";

    return "recommend";
};
