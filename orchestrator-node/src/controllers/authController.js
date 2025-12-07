const AuthService = require('../services/authService');
const LocationService = require('../services/locationService');

const authService = new AuthService();
const locationService = new LocationService();

// Register handler
exports.handleRegister = async (req, res) => {
    try {
        const { email, password, name } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                message: 'Email, password, and name are required'
            });
        }

        const result = authService.register(email, password, name);
        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        console.error('[AuthController] Registration error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: error.message
        });
    }
};

// Login handler
exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const result = authService.login(email, password);
        res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
        console.error('[AuthController] Login error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: error.message
        });
    }
};

// Logout handler
exports.handleLogout = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(400).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const result = authService.logout(sessionId);
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Logout error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: error.message
        });
    }
};

// Get user profile
exports.handleGetProfile = async (req, res) => {
    try {
        const { sessionId } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const profile = authService.getUserProfile(verified.userId);
        res.json(profile);
    } catch (error) {
        console.error('[AuthController] Get profile error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to get profile',
            error: error.message
        });
    }
};

// Add address
exports.handleAddAddress = async (req, res) => {
    try {
        const { sessionId, address } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const result = authService.addAddress(verified.userId, address);
        res.status(result.success ? 201 : 400).json(result);
    } catch (error) {
        console.error('[AuthController] Add address error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to add address',
            error: error.message
        });
    }
};

// Update GPS location
exports.handleUpdateGPS = async (req, res) => {
    try {
        const { sessionId, location } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        if (!location || !location.latitude || !location.longitude) {
            return res.status(400).json({
                success: false,
                message: 'Valid latitude and longitude are required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const result = authService.updateGPSLocation(verified.userId, location);
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Update GPS error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to update GPS location',
            error: error.message
        });
    }
};

// Toggle GPS mode
exports.handleToggleGPS = async (req, res) => {
    try {
        const { sessionId, enabled } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const result = authService.toggleGPSMode(verified.userId, enabled);
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Toggle GPS error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle GPS mode',
            error: error.message
        });
    }
};

// Update preferences
exports.handleUpdatePreferences = async (req, res) => {
    try {
        const { sessionId, preferences } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const result = authService.updatePreferences(verified.userId, preferences);
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Update preferences error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to update preferences',
            error: error.message
        });
    }
};

// Find nearby stores (requires authentication for location)
exports.handleFindNearbyStores = async (req, res) => {
    try {
        const { sessionId, location, radius } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        // Get user's current location from profile
        const profile = authService.getUserProfile(verified.userId);
        const userLocation = location || profile.user.currentLocation;

        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
            return res.status(400).json({
                success: false,
                message: 'User location not available. Please enable GPS or provide location.'
            });
        }

        const result = locationService.findNearbyStores(userLocation, radius || 15);
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Find nearby stores error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to find nearby stores',
            error: error.message
        });
    }
};

// Get all stores (no authentication required)
exports.handleGetAllStores = async (req, res) => {
    try {
        const result = locationService.getAllStores();
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Get all stores error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to get stores',
            error: error.message
        });
    }
};

// Check product availability across stores
exports.handleCheckAvailability = async (req, res) => {
    try {
        const { productId, location, radiusKm } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: 'Product ID is required'
            });
        }

        const result = locationService.checkProductAvailability(productId, location, radiusKm);
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Check availability error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to check product availability',
            error: error.message
        });
    }
};

// Search products in nearby stores
exports.handleSearchNearbyProducts = async (req, res) => {
    try {
        const { sessionId, query, location, radius } = req.body;

        if (!sessionId) {
            return res.status(401).json({
                success: false,
                message: 'Session ID is required'
            });
        }

        if (!query) {
            return res.status(400).json({
                success: false,
                message: 'Search query is required'
            });
        }

        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        // Get user's current location from profile
        const profile = authService.getUserProfile(verified.userId);
        const userLocation = location || profile.user.currentLocation;

        if (!userLocation || !userLocation.latitude || !userLocation.longitude) {
            return res.status(400).json({
                success: false,
                message: 'User location not available. Please enable GPS or provide location.'
            });
        }

        const result = locationService.searchProductsInNearbyStores(
            query,
            userLocation,
            { radius: radius || 15 }
        );
        res.json(result);
    } catch (error) {
        console.error('[AuthController] Search nearby products error:', error.message);
        res.status(500).json({
            success: false,
            message: 'Failed to search nearby products',
            error: error.message
        });
    }
};
