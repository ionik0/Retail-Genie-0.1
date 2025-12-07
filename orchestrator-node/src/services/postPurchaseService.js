const fs = require('fs');
const path = require('path');

// Load mock data
const customersPath = path.join(__dirname, '../data/customers.json');
const ordersPath = path.join(__dirname, '../data/orders.json');
const shipmentsPath = path.join(__dirname, '../data/shipments.json');
const feedbackPath = path.join(__dirname, '../data/feedback.json');

let customers = [];
let orders = [];
let shipments = [];
let feedbacks = [];

// Initialize mock data files if they don't exist
const initializeDataFiles = () => {
    if (!fs.existsSync(ordersPath)) {
        fs.writeFileSync(ordersPath, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(shipmentsPath)) {
        fs.writeFileSync(shipmentsPath, JSON.stringify([], null, 2));
    }
    if (!fs.existsSync(feedbackPath)) {
        fs.writeFileSync(feedbackPath, JSON.stringify([], null, 2));
    }

    // Load data
    customers = JSON.parse(fs.readFileSync(customersPath, 'utf8'));
    orders = JSON.parse(fs.readFileSync(ordersPath, 'utf8'));
    shipments = JSON.parse(fs.readFileSync(shipmentsPath, 'utf8'));
    feedbacks = JSON.parse(fs.readFileSync(feedbackPath, 'utf8'));
};

// Service functions
exports.getOrderStatus = (orderId) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return { success: false, message: 'Order not found', order_id: orderId };
    }
    
    const shipment = shipments.find(s => s.order_id === orderId);
    return {
        success: true,
        order,
        shipment: shipment || { status: 'preparing' },
        estimated_delivery: shipment ? shipment.estimated_delivery : 'TBD'
    };
};

exports.trackShipment = (orderId) => {
    const shipment = shipments.find(s => s.order_id === orderId);
    if (!shipment) {
        return { success: false, message: 'Shipment not found', order_id: orderId };
    }

    return {
        success: true,
        shipment,
        tracking_events: shipment.tracking_events || [],
        current_location: shipment.current_location,
        estimated_delivery: shipment.estimated_delivery
    };
};

exports.initiateReturn = (orderId, reason) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return { success: false, message: 'Order not found' };
    }

    if (order.status !== 'delivered') {
        return { success: false, message: 'Only delivered orders can be returned' };
    }

    const returnId = `RET${Date.now()}`;
    const returnRequest = {
        return_id: returnId,
        order_id: orderId,
        reason,
        status: 'initiated',
        initiated_at: new Date().toISOString(),
        authorized: false,
        refund_status: 'pending'
    };

    orders = orders.map(o => 
        o.order_id === orderId ? { ...o, status: 'return_initiated' } : o
    );

    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));
    
    return {
        success: true,
        return_id: returnId,
        message: 'Return initiated successfully',
        next_steps: ['Ship the items back to us', 'Use prepaid return label', 'Track return status']
    };
};

exports.initiateExchange = (orderId, newProductId, reason) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return { success: false, message: 'Order not found' };
    }

    const exchangeId = `EXC${Date.now()}`;
    const exchangeRequest = {
        exchange_id: exchangeId,
        order_id: orderId,
        old_product_id: order.items[0].product_id,
        new_product_id: newProductId,
        reason,
        status: 'initiated',
        initiated_at: new Date().toISOString(),
        authorized: false
    };

    orders = orders.map(o => 
        o.order_id === orderId ? { ...o, status: 'exchange_initiated' } : o
    );

    fs.writeFileSync(ordersPath, JSON.stringify(orders, null, 2));

    return {
        success: true,
        exchange_id: exchangeId,
        message: 'Exchange initiated successfully',
        refund_difference: 0,
        additional_charge: 0,
        next_steps: ['Return old item', 'New item ships on confirmation']
    };
};

exports.getReturnHistory = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    if (!customer) {
        return { success: false, message: 'Customer not found' };
    }

    const customerOrders = orders.filter(o => {
        const cust = customers.find(c => c.customer_id === customerId);
        return cust && cust.purchase_history.some(h => h.order_id === o.order_id);
    });

    const returns = customerOrders.filter(o => o.status.includes('return'));
    return {
        success: true,
        customer_id: customerId,
        returns_count: returns.length,
        returns
    };
};

exports.submitFeedback = (orderId, rating, comment, recommend) => {
    const order = orders.find(o => o.order_id === orderId);
    if (!order) {
        return { success: false, message: 'Order not found' };
    }

    const feedback = {
        feedback_id: `FBK${Date.now()}`,
        order_id: orderId,
        rating,
        comment,
        recommend,
        submitted_at: new Date().toISOString(),
        helpful_count: 0
    };

    feedbacks.push(feedback);
    fs.writeFileSync(feedbackPath, JSON.stringify(feedbacks, null, 2));

    // Update customer loyalty points
    const customer = customers.find(c => 
        c.purchase_history.some(h => h.order_id === orderId)
    );
    if (customer) {
        customer.loyalty_points += 50; // Bonus points for feedback
        fs.writeFileSync(customersPath, JSON.stringify(customers, null, 2));
    }

    return {
        success: true,
        feedback_id: feedback.feedback_id,
        message: 'Thank you for your feedback!',
        bonus_points: 50
    };
};

exports.getAvailableReturns = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    if (!customer) {
        return { success: false, message: 'Customer not found' };
    }

    const returnableOrders = customer.purchase_history.filter(order => {
        const status = order.status;
        const daysAgo = (new Date() - new Date(order.date)) / (1000 * 60 * 60 * 24);
        return status === 'delivered' && daysAgo <= 30;
    });

    return {
        success: true,
        customer_id: customerId,
        returnable_orders_count: returnableOrders.length,
        orders: returnableOrders,
        return_window_days: 30
    };
};

exports.getLoyaltyPoints = (customerId) => {
    const customer = customers.find(c => c.customer_id === customerId);
    if (!customer) {
        return { success: false, message: 'Customer not found' };
    }

    return {
        success: true,
        customer_id: customerId,
        loyalty_points: customer.loyalty_points,
        loyalty_tier: customer.loyalty_tier,
        next_tier_points: customer.loyalty_tier === 'Platinum' ? null : 
                         customer.loyalty_tier === 'Gold' ? 15000 - customer.loyalty_points :
                         5000 - customer.loyalty_points
    };
};

// Initialize data files on module load
initializeDataFiles();

module.exports.initializeDataFiles = initializeDataFiles;
