const logger = require('../utils/logger');

// Centralized error handler middleware
const errorHandler = (err, req, res, next) => {
    logger.error(`[ErrorHandler] ${err.message}\nStack: ${err.stack}`);

    // Validation error
    if (err.type === 'validation') {
        return res.status(400).json({
            success: false,
            code: 'VALIDATION_ERROR',
            message: err.message,
            errors: err.errors || [],
            status: 400
        });
    }

    // Not found error
    if (err.type === 'not_found') {
        return res.status(404).json({
            success: false,
            code: 'NOT_FOUND',
            message: err.message || 'Resource not found',
            status: 404
        });
    }

    // Unauthorized error
    if (err.type === 'unauthorized') {
        return res.status(401).json({
            success: false,
            code: 'UNAUTHORIZED',
            message: err.message || 'Unauthorized access',
            status: 401
        });
    }

    // Forbidden error
    if (err.type === 'forbidden') {
        return res.status(403).json({
            success: false,
            code: 'FORBIDDEN',
            message: err.message || 'Access forbidden',
            status: 403
        });
    }

    // Conflict error
    if (err.type === 'conflict') {
        return res.status(409).json({
            success: false,
            code: 'CONFLICT',
            message: err.message,
            status: 409
        });
    }

    // Rate limit error
    if (err.type === 'rate_limit') {
        return res.status(429).json({
            success: false,
            code: 'RATE_LIMIT_EXCEEDED',
            message: err.message || 'Too many requests. Please try again later.',
            status: 429
        });
    }

    // Default server error
    res.status(err.status || 500).json({
        success: false,
        code: 'SERVER_ERROR',
        message: process.env.NODE_ENV === 'production' 
            ? 'An error occurred on the server'
            : err.message,
        status: err.status || 500
    });
};

// Async handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

// 404 handler
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        code: 'ENDPOINT_NOT_FOUND',
        message: `Endpoint ${req.method} ${req.path} not found`,
        status: 404
    });
};

module.exports = {
    errorHandler,
    asyncHandler,
    notFoundHandler
};
