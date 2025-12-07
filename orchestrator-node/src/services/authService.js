const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

// Enhanced authentication system with JWT & security
class AuthService {
    constructor() {
        this.usersFile = path.join(__dirname, '../data/users.json');
        this.sessionsFile = path.join(__dirname, '../data/sessions.json');
        this.refreshTokensFile = path.join(__dirname, '../data/refresh-tokens.json');
        this.JWT_SECRET = process.env.JWT_SECRET || 'retail-genie-secret-key-2024';
        this.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-2024';
        this.TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || '24h';
        this.loadUsers();
        this.loadSessions();
        this.loadRefreshTokens();
    }

    loadUsers() {
        try {
            this.users = JSON.parse(fs.readFileSync(this.usersFile, 'utf8'));
        } catch (e) {
            this.users = [];
        }
    }

    loadSessions() {
        try {
            this.sessions = JSON.parse(fs.readFileSync(this.sessionsFile, 'utf8'));
        } catch (e) {
            this.sessions = [];
        }
    }

    loadRefreshTokens() {
        try {
            this.refreshTokens = JSON.parse(fs.readFileSync(this.refreshTokensFile, 'utf8'));
        } catch (e) {
            this.refreshTokens = [];
        }
    }

    saveUsers() {
        fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
    }

    saveSessions() {
        fs.writeFileSync(this.sessionsFile, JSON.stringify(this.sessions, null, 2));
    }

    saveRefreshTokens() {
        fs.writeFileSync(this.refreshTokensFile, JSON.stringify(this.refreshTokens, null, 2));
    }

    // Secure password hashing with bcrypt
    async hashPassword(password) {
        try {
            return await bcrypt.hash(password, 10);
        } catch (error) {
            logger.error(`[AuthService] Password hashing failed: ${error.message}`);
            throw error;
        }
    }

    // Verify password
    async verifyPassword(password, hash) {
        try {
            return await bcrypt.compare(password, hash);
        } catch (error) {
            logger.error(`[AuthService] Password verification failed: ${error.message}`);
            return false;
        }
    }

    // Generate JWT tokens
    generateTokens(userId, userEmail, role = 'user') {
        try {
            const accessToken = jwt.sign(
                { userId, email: userEmail, role, type: 'access' },
                this.JWT_SECRET,
                { expiresIn: this.TOKEN_EXPIRY }
            );

            const refreshToken = jwt.sign(
                { userId, email: userEmail, role, type: 'refresh' },
                this.JWT_REFRESH_SECRET,
                { expiresIn: '7d' }
            );

            return { accessToken, refreshToken };
        } catch (error) {
            logger.error(`[AuthService] Token generation failed: ${error.message}`);
            throw error;
        }
    }

    // Verify JWT token
    verifyToken(token, isRefreshToken = false) {
        try {
            const secret = isRefreshToken ? this.JWT_REFRESH_SECRET : this.JWT_SECRET;
            return jwt.verify(token, secret);
        } catch (error) {
            logger.error(`[AuthService] Token verification failed: ${error.message}`);
            return null;
        }
    }

    // Register new user (async)
    async register(email, password, name, phone = '', role = 'customer') {
        try {
            // Validate input
            if (!email || !password || !name) {
                return { success: false, code: 'VALIDATION_ERROR', message: 'Email, password, and name are required' };
            }

            // Check if user exists
            if (this.users.find(u => u.email === email)) {
                return { success: false, code: 'USER_EXISTS', message: 'Email already registered' };
            }

            // Hash password
            const hashedPassword = await this.hashPassword(password);

            const user = {
                id: `USER${Date.now()}`,
                email,
                password: hashedPassword,
                name,
                phone,
                role, // 'customer', 'agent', 'admin'
                status: 'active',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                addresses: [],
                gpsEnabled: false,
                currentLocation: null,
                loyaltyPoints: 0,
                tier: 'bronze', // bronze, silver, gold
                preferences: {
                    radius: 15, // km
                    sortBy: 'price', // price, rating, distance
                    notifications: true,
                    language: 'en',
                    currency: 'INR'
                },
                profile: {
                    avatar: '',
                    bio: '',
                    verified: false,
                    verifiedAt: null
                },
                stats: {
                    totalOrders: 0,
                    totalSpent: 0,
                    lastOrderDate: null,
                    averageRating: 0
                }
            };

            this.users.push(user);
            this.saveUsers();

            logger.info(`[AuthService] User registered: ${email}`);

            return {
                success: true,
                code: 'REGISTRATION_SUCCESS',
                message: 'Registration successful',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    profile: user.profile
                }
            };
        } catch (error) {
            logger.error(`[AuthService] Registration failed: ${error.message}`);
            return { success: false, code: 'REGISTRATION_ERROR', message: error.message };
        }
    }

    // Login user (async)
    async login(email, password) {
        try {
            // Validate input
            if (!email || !password) {
                return { success: false, code: 'VALIDATION_ERROR', message: 'Email and password are required', status: 401 };
            }

            const user = this.users.find(u => u.email === email);

            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'Invalid email or password', status: 401 };
            }

            // Verify password
            const passwordValid = await this.verifyPassword(password, user.password);

            if (!passwordValid) {
                return { success: false, code: 'INVALID_PASSWORD', message: 'Invalid email or password', status: 401 };
            }

            if (user.status !== 'active') {
                return { success: false, code: 'USER_INACTIVE', message: 'Account is inactive', status: 403 };
            }

            // Generate tokens
            const { accessToken, refreshToken } = this.generateTokens(user.id, user.email, user.role);

            // Store refresh token
            const tokenRecord = {
                id: `TOKEN${Date.now()}`,
                userId: user.id,
                refreshToken,
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
            };
            this.refreshTokens.push(tokenRecord);
            this.saveRefreshTokens();

            logger.info(`[AuthService] User logged in: ${email}`);

            return {
                success: true,
                code: 'LOGIN_SUCCESS',
                message: 'Login successful',
                status: 200,
                tokens: {
                    accessToken,
                    refreshToken,
                    expiresIn: '24h'
                },
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    addresses: user.addresses,
                    preferences: user.preferences,
                    loyaltyPoints: user.loyaltyPoints,
                    tier: user.tier
                }
            };
        } catch (error) {
            logger.error(`[AuthService] Login failed: ${error.message}`);
            return { success: false, code: 'LOGIN_ERROR', message: error.message, status: 500 };
        }
    }

    // Verify JWT token
    verifyAccessToken(token) {
        try {
            const decoded = this.verifyToken(token, false);
            if (!decoded) {
                return { valid: false, code: 'INVALID_TOKEN', message: 'Invalid or expired token', status: 401 };
            }

            const user = this.users.find(u => u.id === decoded.userId);
            if (!user) {
                return { valid: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            if (user.status !== 'active') {
                return { valid: false, code: 'USER_INACTIVE', message: 'User account is inactive', status: 403 };
            }

            return {
                valid: true,
                userId: decoded.userId,
                email: decoded.email,
                role: decoded.role,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    addresses: user.addresses,
                    gpsEnabled: user.gpsEnabled,
                    currentLocation: user.currentLocation,
                    preferences: user.preferences,
                    loyaltyPoints: user.loyaltyPoints,
                    tier: user.tier
                }
            };
        } catch (error) {
            logger.error(`[AuthService] Token verification failed: ${error.message}`);
            return { valid: false, code: 'TOKEN_ERROR', message: error.message, status: 401 };
        }
    }

    // Refresh access token
    refreshAccessToken(refreshToken) {
        try {
            const decoded = this.verifyToken(refreshToken, true);
            if (!decoded) {
                return { success: false, code: 'INVALID_REFRESH_TOKEN', message: 'Invalid or expired refresh token', status: 401 };
            }

            // Check if refresh token exists in database
            const tokenRecord = this.refreshTokens.find(t => t.refreshToken === refreshToken);
            if (!tokenRecord) {
                return { success: false, code: 'REFRESH_TOKEN_REVOKED', message: 'Refresh token was revoked', status: 401 };
            }

            // Generate new access token
            const { accessToken } = this.generateTokens(decoded.userId, decoded.email, decoded.role);

            logger.info(`[AuthService] Access token refreshed for user: ${decoded.email}`);

            return {
                success: true,
                code: 'TOKEN_REFRESHED',
                accessToken,
                expiresIn: '24h'
            };
        } catch (error) {
            logger.error(`[AuthService] Token refresh failed: ${error.message}`);
            return { success: false, code: 'REFRESH_ERROR', message: error.message, status: 500 };
        }
    }

    // Logout user
    logout(userId, refreshToken) {
        try {
            // Revoke refresh token
            this.refreshTokens = this.refreshTokens.filter(t => t.refreshToken !== refreshToken);
            this.saveRefreshTokens();

            logger.info(`[AuthService] User logged out: ${userId}`);

            return {
                success: true,
                code: 'LOGOUT_SUCCESS',
                message: 'Logged out successfully',
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Logout failed: ${error.message}`);
            return { success: false, code: 'LOGOUT_ERROR', message: error.message, status: 500 };
        }
    }

    // Verify session (backward compatibility)
    verifySession(sessionId) {
        const session = this.sessions.find(s => s.sessionId === sessionId);
        
        if (!session) {
            return { valid: false };
        }

        if (new Date(session.expiresAt) < new Date()) {
            this.sessions = this.sessions.filter(s => s.sessionId !== sessionId);
            this.saveSessions();
            return { valid: false, message: 'Session expired' };
        }

        const user = this.users.find(u => u.id === session.userId);
        return { 
            valid: true, 
            userId: session.userId,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                addresses: user.addresses,
                gpsEnabled: user.gpsEnabled,
                currentLocation: user.currentLocation,
                preferences: user.preferences
            }
        };
    }

    // Add address
    addAddress(userId, address) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            // Validate address
            if (!address.street || !address.city || !address.state || !address.postalCode) {
                return { success: false, code: 'VALIDATION_ERROR', message: 'Street, city, state, and postal code are required', status: 400 };
            }

            const newAddress = {
                id: `ADDR${Date.now()}`,
                street: address.street,
                city: address.city,
                state: address.state,
                postalCode: address.postalCode,
                country: address.country || 'India',
                phone: address.phone || '',
                coordinates: address.coordinates || null, // { latitude, longitude }
                isDefault: address.isDefault || user.addresses.length === 0,
                type: address.type || 'home', // home, work, other
                label: address.label || '',
                createdAt: new Date().toISOString()
            };

            // If this is set as default, unset others
            if (newAddress.isDefault) {
                user.addresses.forEach(addr => addr.isDefault = false);
            }

            user.addresses.push(newAddress);
            user.updatedAt = new Date().toISOString();
            this.saveUsers();

            logger.info(`[AuthService] Address added for user: ${userId}`);

            return {
                success: true,
                code: 'ADDRESS_ADDED',
                message: 'Address added successfully',
                address: newAddress,
                status: 201
            };
        } catch (error) {
            logger.error(`[AuthService] Add address failed: ${error.message}`);
            return { success: false, code: 'ADDRESS_ERROR', message: error.message, status: 500 };
        }
    }

    // Update address
    updateAddress(userId, addressId, addressData) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            const address = user.addresses.find(a => a.id === addressId);
            if (!address) {
                return { success: false, code: 'ADDRESS_NOT_FOUND', message: 'Address not found', status: 404 };
            }

            // Update address fields
            Object.assign(address, addressData, { updatedAt: new Date().toISOString() });

            // If this is set as default, unset others
            if (address.isDefault) {
                user.addresses.forEach(addr => {
                    if (addr.id !== addressId) addr.isDefault = false;
                });
            }

            user.updatedAt = new Date().toISOString();
            this.saveUsers();

            logger.info(`[AuthService] Address updated for user: ${userId}`);

            return {
                success: true,
                code: 'ADDRESS_UPDATED',
                message: 'Address updated successfully',
                address,
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Update address failed: ${error.message}`);
            return { success: false, code: 'ADDRESS_ERROR', message: error.message, status: 500 };
        }
    }

    // Delete address
    deleteAddress(userId, addressId) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            const addressIndex = user.addresses.findIndex(a => a.id === addressId);
            if (addressIndex === -1) {
                return { success: false, code: 'ADDRESS_NOT_FOUND', message: 'Address not found', status: 404 };
            }

            user.addresses.splice(addressIndex, 1);
            user.updatedAt = new Date().toISOString();
            this.saveUsers();

            logger.info(`[AuthService] Address deleted for user: ${userId}`);

            return {
                success: true,
                code: 'ADDRESS_DELETED',
                message: 'Address deleted successfully',
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Delete address failed: ${error.message}`);
            return { success: false, code: 'ADDRESS_ERROR', message: error.message, status: 500 };
        }
    }

    // Get all addresses
    getAddresses(userId) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            return {
                success: true,
                code: 'ADDRESSES_RETRIEVED',
                addresses: user.addresses,
                total: user.addresses.length,
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Get addresses failed: ${error.message}`);
            return { success: false, code: 'ADDRESS_ERROR', message: error.message, status: 500 };
        }
    }

    // Update GPS location
    updateGPSLocation(userId, location) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            // Validate coordinates
            if (!location.latitude || !location.longitude) {
                return { success: false, code: 'VALIDATION_ERROR', message: 'Latitude and longitude are required', status: 400 };
            }

            user.currentLocation = {
                latitude: parseFloat(location.latitude),
                longitude: parseFloat(location.longitude),
                timestamp: new Date().toISOString(),
                accuracy: location.accuracy || null,
                address: location.address || null,
                speed: location.speed || null
            };

            user.gpsEnabled = true;
            user.updatedAt = new Date().toISOString();
            this.saveUsers();

            logger.info(`[AuthService] GPS location updated for user: ${userId}`);

            return {
                success: true,
                code: 'LOCATION_UPDATED',
                message: 'Location updated successfully',
                location: user.currentLocation,
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Update GPS failed: ${error.message}`);
            return { success: false, code: 'GPS_ERROR', message: error.message, status: 500 };
        }
    }

    // Enable/disable GPS mode
    toggleGPSMode(userId, enabled) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            user.gpsEnabled = enabled;
            user.updatedAt = new Date().toISOString();

            if (!enabled) {
                user.currentLocation = null;
            }

            this.saveUsers();

            logger.info(`[AuthService] GPS mode ${enabled ? 'enabled' : 'disabled'} for user: ${userId}`);

            return {
                success: true,
                code: 'GPS_TOGGLED',
                message: `GPS mode ${enabled ? 'enabled' : 'disabled'}`,
                gpsEnabled: user.gpsEnabled,
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Toggle GPS failed: ${error.message}`);
            return { success: false, code: 'GPS_ERROR', message: error.message, status: 500 };
        }
    }

    // Get user profile
    getUserProfile(userId) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            const { password, ...userProfile } = user;

            return {
                success: true,
                code: 'PROFILE_RETRIEVED',
                user: userProfile,
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Get profile failed: ${error.message}`);
            return { success: false, code: 'PROFILE_ERROR', message: error.message, status: 500 };
        }
    }

    // Update user profile
    updateUserProfile(userId, profileData) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            // Don't allow updating sensitive fields
            const allowedFields = ['name', 'phone', 'profile'];
            const updatedFields = {};

            for (const field of allowedFields) {
                if (profileData[field] !== undefined) {
                    updatedFields[field] = profileData[field];
                }
            }

            Object.assign(user, updatedFields, { updatedAt: new Date().toISOString() });
            this.saveUsers();

            logger.info(`[AuthService] Profile updated for user: ${userId}`);

            return {
                success: true,
                code: 'PROFILE_UPDATED',
                message: 'Profile updated successfully',
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    profile: user.profile
                },
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Update profile failed: ${error.message}`);
            return { success: false, code: 'PROFILE_ERROR', message: error.message, status: 500 };
        }
    }

    // Update user preferences
    updatePreferences(userId, preferences) {
        try {
            const user = this.users.find(u => u.id === userId);
            
            if (!user) {
                return { success: false, code: 'USER_NOT_FOUND', message: 'User not found', status: 404 };
            }

            user.preferences = {
                ...user.preferences,
                ...preferences
            };

            user.updatedAt = new Date().toISOString();
            this.saveUsers();

            logger.info(`[AuthService] Preferences updated for user: ${userId}`);

            return {
                success: true,
                code: 'PREFERENCES_UPDATED',
                message: 'Preferences updated successfully',
                preferences: user.preferences,
                status: 200
            };
        } catch (error) {
            logger.error(`[AuthService] Update preferences failed: ${error.message}`);
            return { success: false, code: 'PREFERENCES_ERROR', message: error.message, status: 500 };
        }
    }
}

module.exports = AuthService;
