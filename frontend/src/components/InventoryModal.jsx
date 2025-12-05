import inventoryData from '../data/inventory.json';

const InventoryModal = ({ product, isOpen, onClose, onProceedToCheckout }) => {
  if (!isOpen || !product) return null;

  const inventory = inventoryData[product.id];
  const availableStores = inventory 
    ? Object.entries(inventory.stores).filter(([_, data]) => data.available && data.stock > 0)
    : [];
  const warehouseAvailable = inventory?.warehouse?.stock > 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              📦 Inventory Check - {product.name}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          <div className="space-y-4">
            {/* Warehouse Status */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Warehouse Stock</h3>
                  <p className="text-sm text-gray-600">
                    {inventory?.warehouse?.location || 'Mumbai Warehouse'}
                  </p>
                </div>
                {warehouseAvailable ? (
                  <div className="text-right">
                    <div className="text-green-600 font-bold text-lg">
                      ✅ Available
                    </div>
                    <div className="text-sm text-gray-600">
                      {inventory.warehouse.stock} units
                    </div>
                  </div>
                ) : (
                  <div className="text-red-600 font-bold">❌ Out of Stock</div>
                )}
              </div>
            </div>

            {/* Store Availability */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">Store Availability</h3>
              <div className="grid grid-cols-2 gap-3">
                {availableStores.length > 0 ? (
                  availableStores.map(([store, data]) => (
                    <div
                      key={store}
                      className="bg-green-50 border border-green-200 rounded-lg p-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-800">{store}</span>
                        <span className="text-green-600 font-bold">✅</span>
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {data.stock} units available
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-4 text-gray-500">
                    No stores have this item in stock
                  </div>
                )}
              </div>
            </div>

            {/* Out of Stock Stores */}
            {inventory && Object.entries(inventory.stores).some(([_, data]) => !data.available || data.stock === 0) && (
              <div>
                <h3 className="font-semibold text-gray-800 mb-2 text-sm">Out of Stock</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(inventory.stores)
                    .filter(([_, data]) => !data.available || data.stock === 0)
                    .map(([store, _]) => (
                      <span
                        key={store}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm"
                      >
                        {store} ❌
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/* Fulfillment Options */}
            <div className="border-t border-gray-200 pt-4 mt-4">
              <h3 className="font-semibold text-gray-800 mb-3">Fulfillment Options</h3>
              <div className="space-y-2">
                {warehouseAvailable && (
                  <button
                    onClick={() => onProceedToCheckout(product, 'ship_to_home')}
                    className="w-full text-left px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                  >
                    <div className="font-semibold text-gray-800">🚚 Ship to Home</div>
                    <div className="text-sm text-gray-600">Delivery in 3-5 business days</div>
                  </button>
                )}
                {availableStores.length > 0 && (
                  <>
                    <button
                      onClick={() => onProceedToCheckout(product, 'click_collect')}
                      className="w-full text-left px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                    >
                      <div className="font-semibold text-gray-800">📦 Click & Collect</div>
                      <div className="text-sm text-gray-600">
                        Pick up from {availableStores[0][0]} store
                      </div>
                    </button>
                    <button
                      onClick={() => onProceedToCheckout(product, 'try_in_store')}
                      className="w-full text-left px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition"
                    >
                      <div className="font-semibold text-gray-800">🏪 Reserve for Try-On</div>
                      <div className="text-sm text-gray-600">
                        Reserve at {availableStores[0][0]} store for fitting
                      </div>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Alternative Suggestions */}
            {!warehouseAvailable && availableStores.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ This item is currently out of stock. Would you like me to suggest similar alternatives?
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Close
            </button>
            {warehouseAvailable || availableStores.length > 0 ? (
              <button
                onClick={() => onProceedToCheckout(product, 'ship_to_home')}
                className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Proceed to Checkout
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryModal;

