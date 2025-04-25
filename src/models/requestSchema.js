const Joi = require('joi');

const messageSchemas = {
    text: Joi.object({
        type: Joi.string().valid('text').required(),
        parameters: Joi.object({
            message: Joi.string().required()
        }).required(),
        customerMobile: Joi.string().pattern(/^\d{12}$/).required()
    }),

    template: Joi.object({
        type: Joi.string().valid('template').required(),
        parameters: Joi.object({
            template_name: Joi.string().required(),
            language: Joi.object({
                code: Joi.string().required()
            }).required(),
            components: Joi.array().optional()
        }).required(),
        customerMobile: Joi.string().pattern(/^\d{12}$/).required()
    }),

    // Add other message type schemas...
};

module.exports = messageSchemas;