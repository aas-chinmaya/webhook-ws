require('dotenv').config();
const express = require('express');
const logger = require('./config/logger');
const securityMiddleware = require('./middleware/security');
const webhookRoutes = require('./routes/webhookRoutes');
const errorHandler = require('./middleware/errorHandler');
const Webhook=require('./api/webhook')

const app = express();
//const port = process.env.PORT || 3000;
const RATE_LIMIT_MAX=100;
const RATE_LIMIT_WINDOW=900000;
const ALLOWED_ORIGINS="https://your-domain.com";
// Add request logging
app.use((req, res, next) => {
    logger.info(`Incoming ${req.method} request to ${req.url}`);
    next();
});

// Apply security middleware
app.use(securityMiddleware);

// Add response logging
app.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (data) {
        logger.info(`Response sent for ${req.url}`);
        return originalSend.apply(res, arguments);
    };
    next();
});

// Routes
app.use('/api', webhookRoutes);

// Root route handler
app.get('/', (req, res) => {
    res.status(200).json({ message: 'WhatsApp Webhook Server is running', status: 'OK' });
});

// Error handling
app.use(errorHandler);

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception:', err);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    logger.error('Unhandled Rejection:', err);
    process.exit(1);
});
 const port = 5000;



app.listen(port, () => {    // Changed 9000 to port variable
    logger.info(`Server running in live mode on port ${port}!`);
});