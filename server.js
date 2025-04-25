require('dotenv').config();
const express = require('express');
const logger = require('./config/logger');
const securityMiddleware = require('./middleware/security');
const webhookRoutes = require('./routes/webhookRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
//const port = process.env.PORT || 3000;

// Apply security middleware
app.use(securityMiddleware);

// Routes
app.use('/api', webhookRoutes);

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
 const port = process.env.PORT || 9000;

// app.listen(9000, () => {
//     logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
// });

app.listen(port, () => {    // Changed 9000 to port variable
    logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${port}`);
});