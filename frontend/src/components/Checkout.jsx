import { useState, useEffect } from 'react';
import promotionsData from '../data/promotions.json';

const Checkout = ({ product, customer, onOrderComplete, onBack, fulfillmentOption: initialFulfillmentOption }) => {
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [useLoyaltyPoints, setUseLoyaltyPoints] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // pending, processing, failed, success
  const [fulfillmentOption, setFulfillmentOption] = useState(initialFulfillmentOption || 'ship_to_home');

  const basePrice = product?.price || 0;
  const loyaltyPointsToUse = useLoyaltyPoints 
    ? Math.min(customer.loyaltyPoints, Math.floor(basePrice * 0.5 / 100) * 100)
    : 0;
  const loyaltyDiscount = loyaltyPointsToUse / 100;

  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = (basePrice * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount;
    }
  }

  const subtotal = basePrice;
  const total = Math.max(0, subtotal - discount - loyaltyDiscount);

  const applyPromoCode = () => {
    const promo = promotionsData.activePromotions.find(
      p => p.code.toUpperCase() === promoCode.toUpperCase()
    );
    if (promo) {
      setAppliedPromo(promo);
    } else {
      alert('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(() => {
      // Simulate payment failure 30% of the time
      if (Math.random() < 0.3) {
        setPaymentStatus('failed');
      } else {
        setPaymentStatus('success');
        setTimeout(() => {
          onOrderComplete({
            orderId: `ORD${Date.now()}`,
            product,
            total,
            paymentMethod,
            fulfillmentOption,
            customer,
            discount,
            loyaltyPointsUsed: loyaltyPointsToUse,
            loyaltyPointsEarned: Math.floor(total * (promotionsData.loyaltyPointRates[customer.loyaltyTier] || 1))
          });
        }, 1500);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setPaymentStatus('pending');
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No product selected</p>
          <button
            onClick={onBack}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all duration-200"
        >
          ← Back to Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">Order Summary</h2>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                  }}
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">{product.category}</p>
                  <p className="text-lg font-bold text-indigo-600 mt-2">₹{product.price}</p>
                </div>
              </div>

              {/* Fulfillment Option */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fulfillment Option
                </label>
                <select
                  value={fulfillmentOption}
                  onChange={(e) => setFulfillmentOption(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  <option value="ship_to_home">🚚 Ship to Home</option>
                  <option value="click_collect">📦 Click & Collect</option>
                  <option value="try_in_store">🏪 Reserve for Try-On</option>
                </select>
              </div>

              {/* Promo Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <button
                    onClick={applyPromoCode}
                    className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                  >
                    Apply
                  </button>
                </div>
                {appliedPromo && (
                  <div className="mt-2 text-sm text-green-600">
                    ✅ {appliedPromo.description} applied!
                  </div>
                )}
              </div>

              {/* Loyalty Points */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Use Loyalty Points
                  </label>
                  <span className="text-sm text-gray-600">
                    Available: {customer.loyaltyPoints} points
                  </span>
                </div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={useLoyaltyPoints}
                    onChange={(e) => setUseLoyaltyPoints(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <span className="text-sm text-gray-700">
                    Use {loyaltyPointsToUse} points (₹{loyaltyDiscount} off)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="space-y-6">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-gray-100">
              <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4">Payment</h2>

              {/* Payment Methods */}
              <div className="space-y-3 mb-6">
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="font-medium">💳 UPI</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="font-medium">💳 Card</span>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-indigo-300 transition">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 text-indigo-600"
                  />
                  <span className="font-medium">💰 Cash on Delivery</span>
                </label>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2 mb-6">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                {loyaltyDiscount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Loyalty Points</span>
                    <span>-₹{loyaltyDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>

              {/* Payment Status */}
              {paymentStatus === 'processing' && (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700"></div>
                    <span>Processing payment...</span>
                  </div>
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="text-red-700 mb-2">
                    ❌ Payment failed. Please try again.
                  </div>
                  <button
                    onClick={handleRetry}
                    className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                  >
                    Retry Payment
                  </button>
                </div>
              )}

              {/* Pay Button */}
              {paymentStatus !== 'success' && (
                <button
                  onClick={handlePayment}
                  disabled={paymentStatus === 'processing'}
                  className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {paymentStatus === 'processing' ? '⏳ Processing...' : `💳 Pay ₹${total}`}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;

