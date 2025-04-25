const express = require('express');
const router = express.Router();
const { handleWebhook, verifyWebhook } = require('../../src/controllers/webhookController');
const validateRequest = require('../../src/middleware/validateRequest');
const validateWebhook = require('../../src/middleware/validateWebhook');
const rateLimiter = require('../../src/middleware/rateLimiter');

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Webhook endpoints with security
router.post('/webhook', 
    rateLimiter, 
    validateWebhook,
    validateRequest, 
    handleWebhook
);

router.get('/webhook', 
    rateLimiter,
    verifyWebhook
);

module.exports = router;