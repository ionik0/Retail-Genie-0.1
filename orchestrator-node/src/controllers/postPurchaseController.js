const { 
    getOrderStatus, 
    trackShipment, 
    initiateReturn, 
    initiateExchange,
    getReturnHistory,
    submitFeedback,
    getAvailableReturns,
    getLoyaltyPoints 
} = require('../services/postPurchaseService');

exports.handlePostPurchase = async (req, res) => {
    try {
        const { customer_id, action, order_id, params } = req.body;

        if (!customer_id || !action) {
            return res.status(400).json({ 
                error: "customer_id and action are required" 
            });
        }

        console.log(`[PostPurchaseController] ${action} for customer ${customer_id}`);

        switch(action) {
            case 'check_order_status':
                if (!order_id) {
                    return res.status(400).json({ error: "order_id required" });
                }
                const orderStatus = getOrderStatus(order_id);
                return res.json(orderStatus);

            case 'track_shipment':
                if (!order_id) {
                    return res.status(400).json({ error: "order_id required" });
                }
                const tracking = trackShipment(order_id);
                return res.json(tracking);

            case 'initiate_return':
                if (!order_id || !params?.reason) {
                    return res.status(400).json({ error: "order_id and reason required" });
                }
                const returnResponse = initiateReturn(order_id, params.reason);
                return res.json(returnResponse);

            case 'initiate_exchange':
                if (!order_id || !params?.new_product_id || !params?.reason) {
                    return res.status(400).json({ error: "order_id, new_product_id, and reason required" });
                }
                const exchangeResponse = initiateExchange(order_id, params.new_product_id, params.reason);
                return res.json(exchangeResponse);

            case 'get_return_history':
                const returnHistory = getReturnHistory(customer_id);
                return res.json(returnHistory);

            case 'submit_feedback':
                if (!order_id || params?.rating === undefined) {
                    return res.status(400).json({ error: "order_id and rating required" });
                }
                const feedback = submitFeedback(
                    order_id, 
                    params.rating, 
                    params.comment || '', 
                    params.recommend || false
                );
                return res.json(feedback);

            case 'get_available_returns':
                const availableReturns = getAvailableReturns(customer_id);
                return res.json(availableReturns);

            case 'get_loyalty_points':
                const loyaltyInfo = getLoyaltyPoints(customer_id);
                return res.json(loyaltyInfo);

            default:
                return res.status(400).json({ 
                    error: "Unknown action", 
                    valid_actions: [
                        'check_order_status',
                        'track_shipment',
                        'initiate_return',
                        'initiate_exchange',
                        'get_return_history',
                        'submit_feedback',
                        'get_available_returns',
                        'get_loyalty_points'
                    ]
                });
        }
    } catch (error) {
        console.error('[PostPurchaseController] Error:', error);
        return res.status(500).json({
            error: "Failed to process post-purchase request",
            details: error.message
        });
    }
};

exports.getHealthStatus = (req, res) => {
    res.json({
        status: "healthy",
        service: "Post-Purchase Agent",
        version: "1.0.0",
        features: [
            "Order tracking",
            "Shipment tracking",
            "Returns management",
            "Exchanges",
            "Feedback collection",
            "Loyalty points",
            "Order history"
        ]
    });
};
