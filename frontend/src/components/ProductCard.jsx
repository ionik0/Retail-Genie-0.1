const ProductCard = ({ product, onCheckInventory, onAddToCart }) => {
  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border border-gray-100 group">
      <div className="relative overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x400?text=Product+Image';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        {discount > 0 && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg animate-pulse">
            {discount}% OFF
          </div>
        )}
        {product.rating && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-800 shadow-md flex items-center gap-1">
            <span className="text-yellow-400">⭐</span> {product.rating}
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-sm text-gray-500 mb-3 font-medium">{product.category}</p>
        
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">₹{product.price}</span>
          {product.originalPrice && (
            <span className="text-sm text-gray-400 line-through">₹{product.originalPrice}</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
            🎨 {product.colors.slice(0, 2).join(', ')}
          </span>
          <span className="text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded-full font-medium">
            📏 {product.sizes.slice(0, 3).join(', ')}
          </span>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onCheckInventory(product)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 rounded-xl font-bold hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
          >
            📦 Inventory
          </button>
          <button
            onClick={() => onAddToCart(product)}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🛒 Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

