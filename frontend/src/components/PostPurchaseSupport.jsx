import { useState } from 'react';

const PostPurchaseSupport = ({ order, onBack }) => {
  const [activeTab, setActiveTab] = useState('track');
  const [trackingStatus, setTrackingStatus] = useState('in_transit');
  const [returnReason, setReturnReason] = useState('');
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });

  const trackingStages = [
    { id: 'confirmed', label: 'Order Confirmed', icon: '✅', active: true },
    { id: 'processing', label: 'Processing', icon: '📦', active: trackingStatus !== 'confirmed' },
    { id: 'in_transit', label: 'In Transit', icon: '🚚', active: trackingStatus === 'in_transit' || trackingStatus === 'delivered' },
    { id: 'delivered', label: 'Delivered', icon: '🏠', active: trackingStatus === 'delivered' }
  ];

  const handleReturn = () => {
    if (!returnReason) {
      alert('Please select a reason for return');
      return;
    }
    alert(`Return request submitted for ${order.orderId}. Our team will contact you shortly.`);
  };

  const handleFeedback = () => {
    if (!feedback.comment) {
      alert('Please provide your feedback');
      return;
    }
    alert('Thank you for your feedback!');
    setFeedback({ rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="mb-6 text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
        >
          ← Back
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('track')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'track'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              📍 Track Order
            </button>
            <button
              onClick={() => setActiveTab('return')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'return'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              🔄 Return/Exchange
            </button>
            <button
              onClick={() => setActiveTab('feedback')}
              className={`flex-1 px-6 py-4 font-semibold transition ${
                activeTab === 'feedback'
                  ? 'bg-indigo-50 text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              ⭐ Feedback
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Track Order */}
            {activeTab === 'track' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Tracking</h2>
                  <p className="text-gray-600">Order ID: {order?.orderId || 'ORD123456'}</p>
                </div>

                {/* Tracking Timeline */}
                <div className="relative">
                  {trackingStages.map((stage, index) => (
                    <div key={stage.id} className="flex items-start gap-4 mb-6">
                      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                        stage.active ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        {stage.icon}
                      </div>
                      <div className="flex-1 pt-2">
                        <h3 className={`font-semibold ${stage.active ? 'text-gray-800' : 'text-gray-400'}`}>
                          {stage.label}
                        </h3>
                        {stage.id === 'in_transit' && stage.active && (
                          <p className="text-sm text-gray-600 mt-1">
                            Your order is on the way. Expected delivery: {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN')}
                          </p>
                        )}
                        {stage.id === 'delivered' && stage.active && (
                          <p className="text-sm text-gray-600 mt-1">
                            Delivered on {new Date().toLocaleDateString('en-IN')}
                          </p>
                        )}
                      </div>
                      {index < trackingStages.length - 1 && (
                        <div className={`absolute left-6 w-0.5 h-12 ${
                          stage.active ? 'bg-indigo-600' : 'bg-gray-200'
                        }`} style={{ top: `${(index + 1) * 80}px` }}></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Details */}
                {order && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3">Order Details</h3>
                    <div className="flex gap-4">
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{order.product.name}</p>
                        <p className="text-sm text-gray-600">Quantity: 1</p>
                        <p className="text-sm text-gray-600">Total: ₹{order.total}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Return/Exchange */}
            {activeTab === 'return' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Return/Exchange Request</h2>
                  <p className="text-gray-600">Order ID: {order?.orderId || 'ORD123456'}</p>
                </div>

                {order && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{order.product.name}</p>
                        <p className="text-sm text-gray-600">{order.product.category}</p>
                        <p className="text-sm text-gray-600">₹{order.total}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Return/Exchange
                  </label>
                  <select
                    value={returnReason}
                    onChange={(e) => setReturnReason(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="">Select a reason</option>
                    <option value="wrong_size">Wrong Size</option>
                    <option value="defective">Defective Item</option>
                    <option value="not_as_described">Not as Described</option>
                    <option value="changed_mind">Changed My Mind</option>
                    <option value="exchange">Want to Exchange</option>
                  </select>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Return requests must be submitted within 7 days of delivery. Items must be in original condition with tags attached.
                  </p>
                </div>

                <button
                  onClick={handleReturn}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Submit Return Request
                </button>
              </div>
            )}

            {/* Feedback */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Share Your Feedback</h2>
                  <p className="text-gray-600">Help us improve your shopping experience</p>
                </div>

                {order && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex gap-4">
                      <img
                        src={order.product.image}
                        alt={order.product.name}
                        className="w-24 h-24 object-cover rounded-lg"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/100x100?text=Product';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-800">{order.product.name}</p>
                        <p className="text-sm text-gray-600">{order.product.category}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setFeedback({ ...feedback, rating })}
                        className={`text-3xl ${
                          rating <= feedback.rating ? 'text-yellow-400' : 'text-gray-300'
                        } hover:scale-110 transition`}
                      >
                        ⭐
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback.comment}
                    onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                    placeholder="Tell us about your experience..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>

                <button
                  onClick={handleFeedback}
                  className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Submit Feedback
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPurchaseSupport;

