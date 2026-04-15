const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error(err);

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = {
            success: false,
            message: 'Validation Error',
            error: message,
            statusCode: 400
        };
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const value = err.keyValue[field];
        error = {
            success: false,
            message: 'Duplicate Field Error',
            error: `${field} with value '${value}' already exists`,
            statusCode: 400
        };
    }

    // Mongoose cast error
    if (err.name === 'CastError') {
        error = {
            success: false,
            message: 'Invalid ID Format',
            error: 'Resource not found',
            statusCode: 404
        };
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error = {
            success: false,
            message: 'Invalid Token',
            error: 'Token is not valid',
            statusCode: 401
        };
    }

    if (err.name === 'TokenExpiredError') {
        error = {
            success: false,
            message: 'Token Expired',
            error: 'Token has expired',
            statusCode: 401
        };
    }

    // Default error
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        error: process.env.NODE_ENV === 'development' ? error.error || err.message : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};

module.exports = errorHandler;
