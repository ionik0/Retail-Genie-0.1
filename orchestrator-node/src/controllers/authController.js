const AuthService = require('../services/authService');
const LocationService = require('../services/locationService');
const logger = require('../utils/logger');

const authService = new AuthService();
const locationService = new LocationService();

// ==================== AUTHENTICATION ENDPOINTS ====================

// Register handler
exports.handleRegister = async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;

        // Validation
        if (!email || !password || !name) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Email, password, and name are required',
                status: 400
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                code: 'WEAK_PASSWORD',
                message: 'Password must be at least 6 characters',
                status: 400
            });
        }

        const result = await authService.register(email, password, name, phone);
        const statusCode = result.success ? 201 : (result.status || 400);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Registration error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'REGISTRATION_ERROR',
            message: 'Registration failed',
            status: 500
        });
    }
};

// Login handler
exports.handleLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Email and password are required',
                status: 400
            });
        }

        const result = await authService.login(email, password);
        const statusCode = result.status || (result.success ? 200 : 401);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Login error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'LOGIN_ERROR',
            message: 'Login failed',
            status: 500
        });
    }
};

// Logout handler
exports.handleLogout = async (req, res) => {
    try {
        const userId = req.userId;
        const { refreshToken } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        const result = authService.logout(userId, refreshToken);
        res.status(result.status || 200).json(result);
    } catch (error) {
        logger.error(`[AuthController] Logout error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'LOGOUT_ERROR',
            message: 'Logout failed',
            status: 500
        });
    }
};

// Refresh token handler
exports.handleRefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Refresh token is required',
                status: 400
            });
        }

        const result = authService.refreshAccessToken(refreshToken);
        const statusCode = result.status || (result.success ? 200 : 401);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Refresh token error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'TOKEN_ERROR',
            message: 'Token refresh failed',
            status: 500
        });
    }
};

// ==================== PROFILE ENDPOINTS ====================

// Get user profile
exports.handleGetProfile = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

<<<<<<< HEAD
        const result = authService.getUserProfile(userId);
        const statusCode = result.status || (result.success ? 200 : 404);
        res.status(statusCode).json(result);
=======
        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const profile = authService.getUserProfile(verified.userId);
        res.json(profile);
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
    } catch (error) {
        logger.error(`[AuthController] Get profile error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'PROFILE_ERROR',
            message: 'Failed to get profile',
            status: 500
        });
    }
};

// Update user profile
exports.handleUpdateProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const profileData = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        const result = authService.updateUserProfile(userId, profileData);
        const statusCode = result.status || (result.success ? 200 : 400);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Update profile error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'PROFILE_ERROR',
            message: 'Failed to update profile',
            status: 500
        });
    }
};

// ==================== ADDRESS MANAGEMENT ====================

// Get all addresses
exports.handleGetAddresses = async (req, res) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        const result = authService.getAddresses(userId);
        const statusCode = result.status || (result.success ? 200 : 404);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Get addresses error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'ADDRESS_ERROR',
            message: 'Failed to get addresses',
            status: 500
        });
    }
};

// Add address
exports.handleAddAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const address = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

<<<<<<< HEAD
        if (!address) {
            return res.status(400).json({
=======
        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Address data is required',
                status: 400
            });
        }

        const result = authService.addAddress(userId, address);
        const statusCode = result.status || (result.success ? 201 : 400);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Add address error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'ADDRESS_ERROR',
            message: 'Failed to add address',
            status: 500
        });
    }
};

// Update address
exports.handleUpdateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;
        const addressData = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        if (!addressId) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Address ID is required',
                status: 400
            });
        }

        const result = authService.updateAddress(userId, addressId, addressData);
        const statusCode = result.status || (result.success ? 200 : 400);
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Update address error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'ADDRESS_ERROR',
            message: 'Failed to update address',
            status: 500
        });
    }
};

// Delete address
exports.handleDeleteAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        if (!addressId) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Address ID is required',
                status: 400
            });
        }

        const result = authService.deleteAddress(userId, addressId);
        const statusCode = result.status || 200;
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Delete address error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'ADDRESS_ERROR',
            message: 'Failed to delete address',
            status: 500
        });
    }
};

// ==================== GPS & LOCATION ENDPOINTS ====================

// Update GPS location
exports.handleUpdateGPS = async (req, res) => {
    try {
        const userId = req.userId;
        const location = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        if (!location || !location.latitude || !location.longitude) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Latitude and longitude are required',
                status: 400
            });
        }

<<<<<<< HEAD
        const result = authService.updateGPSLocation(userId, location);
        const statusCode = result.status || 200;
        res.status(statusCode).json(result);
=======
        const verified = authService.verifySession(sessionId);

        if (!verified.valid) {
            return res.status(401).json({
                success: false,
                message: verified.message || 'Invalid session'
            });
        }

        const result = authService.updateGPSLocation(verified.userId, location);
        res.json(result);
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
    } catch (error) {
        logger.error(`[AuthController] Update GPS error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'GPS_ERROR',
            message: 'Failed to update GPS location',
            status: 500
        });
    }
};

// Toggle GPS mode
exports.handleToggleGPS = async (req, res) => {
    try {
        const userId = req.userId;
        const { enabled } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

<<<<<<< HEAD
        if (enabled === undefined) {
=======
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
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Enabled flag is required',
                status: 400
            });
        }

        const result = authService.toggleGPSMode(userId, enabled);
        const statusCode = result.status || 200;
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Toggle GPS error: ${error.message}`);
        res.status(500).json({
            success: false,
<<<<<<< HEAD
            code: 'GPS_ERROR',
            message: 'Failed to toggle GPS mode',
            status: 500
=======
            message: 'Failed to find nearby stores',
            error: error.message
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
        });
    }
};

// Find nearby stores
exports.handleFindNearbyStores = async (req, res) => {
    try {
        const userId = req.userId;
        const { radius } = req.query;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        // Get user profile with location
        const profileResult = authService.getUserProfile(userId);
        if (!profileResult.success || !profileResult.user.currentLocation) {
            return res.status(400).json({
                success: false,
                code: 'LOCATION_REQUIRED',
                message: 'GPS location is required to find nearby stores',
                status: 400
            });
        }

        const result = locationService.findNearbyStores(
            profileResult.user.currentLocation,
            radius ? parseInt(radius) : 15
        );
        const statusCode = result.success ? 200 : 404;
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Find nearby stores error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'LOCATION_ERROR',
            message: 'Failed to find nearby stores',
            status: 500
        });
    }
};

// Get all stores
exports.handleGetAllStores = async (req, res) => {
    try {
        const result = locationService.getAllStores();
        res.status(200).json(result);
    } catch (error) {
        logger.error(`[AuthController] Get all stores error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'LOCATION_ERROR',
            message: 'Failed to get stores',
            status: 500
        });
    }
};

// Check product availability
exports.handleCheckAvailability = async (req, res) => {
    try {
        const { storeId, productIds } = req.body;

        if (!storeId) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Store ID is required',
                status: 400
            });
        }

        const result = locationService.getStoreProducts(storeId, productIds || []);
        const statusCode = result.success ? 200 : 404;
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Check availability error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'INVENTORY_ERROR',
            message: 'Failed to check availability',
            status: 500
        });
    }
};

// Search nearby products (location-aware)
exports.handleSearchNearbyProducts = async (req, res) => {
    try {
        const userId = req.userId;
        const { query, radius } = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        if (!query) {
            return res.status(400).json({
                success: false,
                code: 'VALIDATION_ERROR',
                message: 'Search query is required',
                status: 400
            });
        }

<<<<<<< HEAD
        // Get user profile with location
        const profileResult = authService.getUserProfile(userId);
        if (!profileResult.success || !profileResult.user.currentLocation) {
=======
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
>>>>>>> 4790e6c5eeba18121a8e6a07fb9ffbff98435325
            return res.status(400).json({
                success: false,
                code: 'LOCATION_REQUIRED',
                message: 'GPS location is required for location-aware search',
                status: 400
            });
        }

        const result = locationService.searchProductsInNearbyStores(
            query,
            profileResult.user.currentLocation,
            { radius: radius || 15 }
        );
        const statusCode = result.success ? 200 : 404;
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Search nearby products error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'SEARCH_ERROR',
            message: 'Failed to search nearby products',
            status: 500
        });
    }
};

// ==================== PREFERENCES ====================

// Update preferences
exports.handleUpdatePreferences = async (req, res) => {
    try {
        const userId = req.userId;
        const preferences = req.body;

        if (!userId) {
            return res.status(401).json({
                success: false,
                code: 'UNAUTHORIZED',
                message: 'User not authenticated',
                status: 401
            });
        }

        const result = authService.updatePreferences(userId, preferences);
        const statusCode = result.status || 200;
        res.status(statusCode).json(result);
    } catch (error) {
        logger.error(`[AuthController] Update preferences error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'PREFERENCES_ERROR',
            message: 'Failed to update preferences',
            status: 500
        });
    }
};

module.exports = exports;
