const fs = require('fs');
const path = require('path');

class LocationService {
    constructor() {
        this.inventoryFile = path.join(__dirname, '../data/inventory.json');
        this.loadInventory();
    }

    loadInventory() {
        try {
            // Try enhanced inventory first
            const enhancedPath = path.join(__dirname, '../data/inventory-enhanced.json');
            let data;
            
            if (require('fs').existsSync(enhancedPath)) {
                data = JSON.parse(fs.readFileSync(enhancedPath, 'utf8'));
            } else {
                data = JSON.parse(fs.readFileSync(this.inventoryFile, 'utf8'));
            }
            
            this.stores = data.stores || [];
        } catch (e) {
            console.error('Failed to load inventory:', e.message);
            this.stores = [];
        }
    }

    // Calculate distance between two coordinates using Haversine formula
    calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // Earth radius in km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = 
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 10) / 10; // Round to 1 decimal
    }

    // Find nearby stores based on user location
    findNearbyStores(userLocation, radiusKm = 15) {
        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
            return {
                success: false,
                message: 'Valid user location required'
            };
        }

        const nearbyStores = this.stores
            .map(store => ({
                ...store,
                distance: this.calculateDistance(
                    userLocation.latitude,
                    userLocation.longitude,
                    store.coordinates.latitude,
                    store.coordinates.longitude
                )
            }))
            .filter(store => store.distance <= radiusKm)
            .sort((a, b) => a.distance - b.distance);

        return {
            success: true,
            radius: radiusKm,
            userLocation,
            storesFound: nearbyStores.length,
            stores: nearbyStores
        };
    }

    // Get all stores
    getAllStores() {
        return {
            success: true,
            total: this.stores.length,
            stores: this.stores.map(store => ({
                ...store,
                distance: null // Not applicable when not using GPS
            }))
        };
    }

    // Get store by ID
    getStoreById(storeId) {
        const store = this.stores.find(s => s.store_id === storeId);
        
        if (!store) {
            return { success: false, message: 'Store not found' };
        }

        return {
            success: true,
            store
        };
    }

    // Get products available in specific store
    getStoreProducts(storeId, productIds = []) {
        const store = this.stores.find(s => s.store_id === storeId);
        
        if (!store) {
            return { success: false, message: 'Store not found' };
        }

        let productsInStore = store.products;

        // Filter by specific product IDs if provided
        if (productIds.length > 0) {
            productsInStore = productsInStore.filter(p => productIds.includes(p.product_id));
        }

        return {
            success: true,
            store: {
                id: store.store_id,
                name: store.name,
                location: store.location,
                coordinates: store.coordinates,
                distance: store.distance || null
            },
            products: productsInStore,
            totalProducts: productsInStore.length
        };
    }

    // Check product availability across stores
    checkProductAvailability(productId, userLocation = null, radiusKm = 15) {
        const availability = [];

        this.stores.forEach(store => {
            const product = store.products.find(p => p.product_id === productId);
            
            if (product && product.in_stock) {
                const storeInfo = {
                    store_id: store.store_id,
                    store_name: store.name,
                    location: store.location,
                    coordinates: store.coordinates,
                    stock: product.stock,
                    price: product.price,
                    available: true
                };

                // Add distance if user location provided
                if (userLocation && userLocation.latitude && userLocation.longitude) {
                    storeInfo.distance = this.calculateDistance(
                        userLocation.latitude,
                        userLocation.longitude,
                        store.coordinates.latitude,
                        store.coordinates.longitude
                    );
                }

                availability.push(storeInfo);
            }
        });

        // Sort by distance if available
        if (userLocation && userLocation.latitude && userLocation.longitude) {
            availability.sort((a, b) => a.distance - b.distance);
        }

        return {
            success: availability.length > 0,
            productId,
            availability,
            totalStores: availability.length,
            message: availability.length === 0 ? 'Product not available in nearby stores' : `Found in ${availability.length} store(s)`
        };
    }

    // Get recommendations based on location
    getLocationBasedRecommendations(userLocation, preferences = {}) {
        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
            return { success: false, message: 'User location required' };
        }

        const nearbyStores = this.findNearbyStores(userLocation, preferences.radius || 15);

        if (!nearbyStores.success || nearbyStores.stores.length === 0) {
            return { success: false, message: 'No stores found nearby' };
        }

        // Get products from nearby stores
        const allProducts = {};
        nearbyStores.stores.forEach(store => {
            store.products.forEach(product => {
                if (!allProducts[product.product_id]) {
                    allProducts[product.product_id] = {
                        ...product,
                        stores: []
                    };
                }
                allProducts[product.product_id].stores.push({
                    store_id: store.store_id,
                    store_name: store.name,
                    distance: store.distance,
                    stock: product.stock
                });
            });
        });

        // Sort products by availability and distance
        const recommendations = Object.values(allProducts)
            .filter(p => p.in_stock)
            .sort((a, b) => {
                // First by store distance
                const distA = Math.min(...a.stores.map(s => s.distance));
                const distB = Math.min(...b.stores.map(s => s.distance));
                return distA - distB;
            })
            .slice(0, 10);

        return {
            success: true,
            nearbyStores: nearbyStores.stores.length,
            recommendations: recommendations.map(p => ({
                product_id: p.product_id,
                name: p.name,
                price: p.price,
                category: p.category,
                availableIn: p.stores.length,
                nearestStore: p.stores[0],
                allStores: p.stores
            }))
        };
    }

    // Search products across all nearby stores
    searchProductsInNearbyStores(searchQuery, userLocation, preferences = {}) {
        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
            return { success: false, message: 'User location required for this search' };
        }

        const nearbyStores = this.findNearbyStores(userLocation, preferences.radius || 15);

        if (!nearbyStores.success || nearbyStores.stores.length === 0) {
            return { success: false, message: 'No stores found nearby' };
        }

        const queryLower = searchQuery.toLowerCase();
        const results = {};

        nearbyStores.stores.forEach(store => {
            store.products.forEach(product => {
                if (product.name.toLowerCase().includes(queryLower) || 
                    product.category.toLowerCase().includes(queryLower)) {
                    
                    if (!results[product.product_id]) {
                        results[product.product_id] = {
                            ...product,
                            stores: []
                        };
                    }

                    results[product.product_id].stores.push({
                        store_id: store.store_id,
                        store_name: store.name,
                        distance: store.distance,
                        stock: product.stock,
                        price: product.price
                    });
                }
            });
        });

        const searchResults = Object.values(results)
            .filter(p => p.in_stock)
            .sort((a, b) => {
                // Sort by minimum distance to a store
                const distA = Math.min(...a.stores.map(s => s.distance));
                const distB = Math.min(...b.stores.map(s => s.distance));
                return distA - distB;
            });

        return {
            success: true,
            query: searchQuery,
            radius: preferences.radius || 15,
            nearbyStores: nearbyStores.stores.length,
            resultsFound: searchResults.length,
            results: searchResults.map(p => ({
                product_id: p.product_id,
                name: p.name,
                price: p.price,
                category: p.category,
                rating: p.rating,
                availableIn: p.stores.length,
                stores: p.stores.sort((a, b) => a.distance - b.distance)
            }))
        };
    }
}

module.exports = LocationService;
