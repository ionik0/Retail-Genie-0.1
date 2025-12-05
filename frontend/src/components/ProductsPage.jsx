import { useState } from 'react';
import productsData from '../data/products.json';
import ProductCard from './ProductCard';
import InventoryModal from './InventoryModal';

const ProductsPage = ({ customer, onNavigate, onAddToCart }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showInventory, setShowInventory] = useState(false);
  const [cart, setCart] = useState([]);

  const handleCheckInventory = (product) => {
    setSelectedProduct(product);
    setShowInventory(true);
  };

  const handleAddToCart = (product) => {
    setCart([...cart, product]);
    if (onAddToCart) {
      onAddToCart(product);
    }
    alert(`${product.name} added to cart!`);
  };

  const handleProceedToCheckout = (product, fulfillmentOption) => {
    setShowInventory(false);
    onNavigate('checkout', product, fulfillmentOption);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white p-5 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">🛍️</span>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold">ABFRL Store</h1>
              <p className="text-sm text-indigo-100 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Welcome, <span className="font-bold">{customer.name}</span> • 
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  customer.loyaltyTier === 'Platinum' ? 'bg-yellow-400 text-yellow-900' :
                  customer.loyaltyTier === 'Gold' ? 'bg-amber-400 text-amber-900' :
                  'bg-gray-300 text-gray-800'
                }`}>
                  {customer.loyaltyTier}
                </span> Member
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('chat')}
              className="px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-bold hover:bg-indigo-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              💬 Chat with AI
            </button>
            {cart.length > 0 && (
              <button
                onClick={() => onNavigate('checkout', cart[0])}
                className="px-5 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 relative"
              >
                🛒 Cart ({cart.length})
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
                    {cart.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto p-8">
        <div className="mb-8 text-center">
          <h2 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3">
            Our Products
          </h2>
          <p className="text-gray-600 text-lg font-medium">Discover our latest collection</p>
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
            <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsData.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onCheckInventory={handleCheckInventory}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>

      {/* Inventory Modal */}
      <InventoryModal
        product={selectedProduct}
        isOpen={showInventory}
        onClose={() => setShowInventory(false)}
        onProceedToCheckout={handleProceedToCheckout}
      />
    </div>
  );
};

export default ProductsPage;

