const messageSchemas = require('../models/requestSchema');

const validateRequest = (req, res, next) => {
    const { type } = req.body;
    const schema = messageSchemas[type];

    if (!schema) {
        return res.status(400).json({
            success: false,
            message: 'Invalid message type'
        });
    }

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({
            success: false,
            message: error.details[0].message
        });
    }

    next();
};

module.exports = validateRequest;