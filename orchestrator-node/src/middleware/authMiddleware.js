const AuthService = require('../services/authService');
const logger = require('../utils/logger');

const authService = new AuthService();

// Verify JWT token middleware
const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                code: 'NO_TOKEN',
                message: 'No authorization token provided',
                status: 401
            });
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        const verification = authService.verifyAccessToken(token);

        if (!verification.valid) {
            return res.status(verification.status || 401).json({
                success: false,
                code: verification.code,
                message: verification.message,
                status: verification.status || 401
            });
        }

        req.user = verification;
        req.userId = verification.userId;
        req.userRole = verification.role;
        next();
    } catch (error) {
        logger.error(`[AuthMiddleware] Token verification error: ${error.message}`);
        res.status(500).json({
            success: false,
            code: 'AUTH_ERROR',
            message: 'Authentication error',
            status: 500
        });
    }
};

// Role-based access control middleware
const authorizeRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.userRole || !allowedRoles.includes(req.userRole)) {
            logger.warn(`[AuthMiddleware] Unauthorized access attempt - Required roles: ${allowedRoles.join(', ')}, User role: ${req.userRole}`);
            return res.status(403).json({
                success: false,
                code: 'INSUFFICIENT_PERMISSIONS',
                message: 'Insufficient permissions to access this resource',
                status: 403
            });
        }
        next();
    };
};

// Optional token verification (doesn't fail if no token)
const optionalVerifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            req.user = null;
            req.userId = null;
            req.userRole = null;
            return next();
        }

        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        const verification = authService.verifyAccessToken(token);

        if (verification.valid) {
            req.user = verification;
            req.userId = verification.userId;
            req.userRole = verification.role;
        }

        next();
    } catch (error) {
        logger.error(`[AuthMiddleware] Optional token verification error: ${error.message}`);
        req.user = null;
        req.userId = null;
        req.userRole = null;
        next();
    }
};

module.exports = {
    verifyToken,
    authorizeRole,
    optionalVerifyToken
};
