const { detectIntent } = require("../services/intentService");
const { getRecommendations } = require("../services/recommenderService");
const { getApplicableOffers } = require("../services/offerService");
const { createSession, getSession, addToHistory } = require("../services/sessionService");

exports.handleMessage = async (req, res) => {
    const { session_id, message } = req.body;

    let sid = session_id || createSession();

    const session = getSession(sid);

    addToHistory(sid, "user", message);

    const intent = detectIntent(message);

    let max_price = null;
    const match = message.match(/under\s*(\d+)/i) || message.match(/below\s*(\d+)/i);
    if (match) max_price = parseInt(match[1]);

    if (intent === "recommend") {
        const items = await getRecommendations(message, { max_price });
        const offers = getApplicableOffers(items);

        addToHistory(sid, "bot", "sending recommendations");

        return res.json({
            session_id: sid,
            response: "Here are some good options:",
            cards: items,
            offers
        });
    }

    if (intent === "offers") {
        return res.json({
            session_id: sid,
            response: "Here are some offers:",
            offers: getApplicableOffers([])
        });
    }

    if (intent === "cart") {
        return res.json({
            session_id: sid,
            response: "Cart feature: Say 'add <product>' to simulate."
        });
    }

    return res.json({ session_id: sid, response: "Sorry, I didn't understand that." });
};
