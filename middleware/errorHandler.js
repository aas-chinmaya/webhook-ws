const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
};

module.exports = errorHandler;