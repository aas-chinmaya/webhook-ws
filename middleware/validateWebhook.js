const validateWebhookRequest = (req, res, next) => {
    // Skip validation for development environment
    if (process.env.NODE_ENV === 'development') {
        return next();
    }

    const signature = req.headers['x-hub-signature-256'];
    if (!signature) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized request'
        });
    }

    // Allow webhook verification requests
    if (req.method === 'GET' && req.query['hub.mode'] === 'subscribe') {
        return next();
    }

    // For production, implement proper signature validation here
    next();
};

module.exports = validateWebhookRequest;