const OrderSummary = ({ order, onTrackOrder, onReturnItem, onGiveFeedback, onBackToShop }) => {
  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No order found</p>
          <button
            onClick={onBackToShop}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const fulfillmentLabels = {
    ship_to_home: '🚚 Ship to Home',
    click_collect: '📦 Click & Collect',
    try_in_store: '🏪 Reserve for Try-On'
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Success Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          {/* Order Details */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID</span>
              <span className="font-semibold text-gray-800">{order.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order Date</span>
              <span className="font-semibold text-gray-800">
                {new Date().toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Payment Method</span>
              <span className="font-semibold text-gray-800 capitalize">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Fulfillment</span>
              <span className="font-semibold text-gray-800">
                {fulfillmentLabels[order.fulfillmentOption] || order.fulfillmentOption}
              </span>
            </div>
          </div>

          {/* Product Details */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Items</h2>
            <div className="flex gap-4">
              <img
                src={order.product.image}
                alt={order.product.name}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                }}
              />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{order.product.name}</h3>
                <p className="text-sm text-gray-600">{order.product.category}</p>
                <p className="text-lg font-bold text-indigo-600 mt-2">₹{order.total}</p>
              </div>
            </div>
          </div>

          {/* Savings & Loyalty */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold text-gray-800 mb-2">Savings & Rewards</h3>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Discount Applied</span>
                <span className="text-green-600 font-semibold">-₹{order.discount}</span>
              </div>
            )}
            {order.loyaltyPointsUsed > 0 && (
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Loyalty Points Used</span>
                <span className="text-green-600 font-semibold">-{order.loyaltyPointsUsed} points</span>
              </div>
            )}
            <div className="flex justify-between text-sm mt-2 pt-2 border-t border-green-200">
              <span className="text-gray-600">Loyalty Points Earned</span>
              <span className="text-green-600 font-bold">+{order.loyaltyPointsEarned} points</span>
            </div>
          </div>

          {/* Estimated Delivery */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📦</span>
              <h3 className="font-semibold text-gray-800">Estimated Delivery</h3>
            </div>
            <p className="text-sm text-gray-600">
              {order.fulfillmentOption === 'ship_to_home' 
                ? 'Your order will be delivered within 3-5 business days'
                : order.fulfillmentOption === 'click_collect'
                ? 'Ready for pickup in 2-3 hours'
                : 'Reserved for try-on. Visit the store within 24 hours'}
            </p>
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <button
              onClick={onTrackOrder}
              className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
            >
              📍 Track Your Order
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onReturnItem}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                🔄 Return/Exchange
              </button>
              <button
                onClick={onGiveFeedback}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                ⭐ Give Feedback
              </button>
            </div>
            <button
              onClick={onBackToShop}
              className="w-full px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-lg font-semibold hover:bg-indigo-50 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;

