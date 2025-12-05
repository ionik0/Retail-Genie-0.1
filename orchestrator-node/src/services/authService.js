const fs = require('fs');
const path = require('path');

// Simple authentication system
class AuthService {
    constructor() {
        this.usersFile = path.join(__dirname, '../data/users.json');
        this.sessionsFile = path.join(__dirname, '../data/sessions.json');
        this.loadUsers();
        this.loadSessions();
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

    saveUsers() {
        fs.writeFileSync(this.usersFile, JSON.stringify(this.users, null, 2));
    }

    saveSessions() {
        fs.writeFileSync(this.sessionsFile, JSON.stringify(this.sessions, null, 2));
    }

    // Simple password hashing (use bcrypt in production)
    hashPassword(password) {
        return Buffer.from(password).toString('base64');
    }

    // Register new user
    register(email, password, name) {
        if (this.users.find(u => u.email === email)) {
            return { success: false, message: 'Email already registered' };
        }

        const user = {
            id: `USER${Date.now()}`,
            email,
            password: this.hashPassword(password),
            name,
            createdAt: new Date().toISOString(),
            addresses: [],
            gpsEnabled: false,
            currentLocation: null,
            preferences: {
                radius: 15, // km
                sortBy: 'price', // price, rating, distance
                notifications: true
            }
        };

        this.users.push(user);
        this.saveUsers();

        return {
            success: true,
            message: 'Registration successful',
            userId: user.id,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }

    // Login user
    login(email, password) {
        const user = this.users.find(u => u.email === email);
        
        if (!user || user.password !== this.hashPassword(password)) {
            return { success: false, message: 'Invalid credentials' };
        }

        // Create session
        const sessionId = `SESSION${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
        const session = {
            sessionId,
            userId: user.id,
            email: user.email,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        };

        this.sessions.push(session);
        this.saveSessions();

        return {
            success: true,
            message: 'Login successful',
            sessionId,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                addresses: user.addresses,
                gpsEnabled: user.gpsEnabled,
                preferences: user.preferences
            }
        };
    }

    // Verify session
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

    // Logout
    logout(sessionId) {
        this.sessions = this.sessions.filter(s => s.sessionId !== sessionId);
        this.saveSessions();
        return { success: true, message: 'Logged out successfully' };
    }

    // Add address
    addAddress(userId, address) {
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        const newAddress = {
            id: `ADDR${Date.now()}`,
            street: address.street,
            city: address.city,
            state: address.state,
            postalCode: address.postalCode,
            country: address.country,
            coordinates: address.coordinates || null, // { lat, lng }
            isDefault: user.addresses.length === 0,
            type: address.type || 'home' // home, work, other
        };

        user.addresses.push(newAddress);
        this.saveUsers();

        return {
            success: true,
            message: 'Address added successfully',
            address: newAddress
        };
    }

    // Update GPS location
    updateGPSLocation(userId, location) {
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        user.currentLocation = {
            latitude: location.latitude,
            longitude: location.longitude,
            timestamp: new Date().toISOString(),
            accuracy: location.accuracy || null
        };

        user.gpsEnabled = true;
        this.saveUsers();

        return {
            success: true,
            message: 'Location updated',
            location: user.currentLocation
        };
    }

    // Enable/disable GPS mode
    toggleGPSMode(userId, enabled) {
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        user.gpsEnabled = enabled;
        this.saveUsers();

        return {
            success: true,
            message: `GPS mode ${enabled ? 'enabled' : 'disabled'}`,
            gpsEnabled: user.gpsEnabled
        };
    }

    // Get user profile
    getUserProfile(userId) {
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        return {
            success: true,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                addresses: user.addresses,
                gpsEnabled: user.gpsEnabled,
                currentLocation: user.currentLocation,
                preferences: user.preferences,
                createdAt: user.createdAt
            }
        };
    }

    // Update user preferences
    updatePreferences(userId, preferences) {
        const user = this.users.find(u => u.id === userId);
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        user.preferences = {
            ...user.preferences,
            ...preferences
        };

        this.saveUsers();

        return {
            success: true,
            message: 'Preferences updated',
            preferences: user.preferences
        };
    }
}

module.exports = AuthService;
