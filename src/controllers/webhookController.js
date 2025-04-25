const logger = require('../../src/config/logger');
const whatsappService = require('../../src/services/whatsappService');
const whatsappConfig = require('../../src/config/whatsapp');

const handleWebhook = async (req, res, next) => {
    try {
        // Handle incoming webhook notifications from WhatsApp
        if (req.body.object === 'whatsapp_business_account') {
            const entries = req.body.entry;
            for (const entry of entries) {
                const changes = entry.changes;
                for (const change of changes) {
                    if (change.field === 'messages') {
                        await handleIncomingMessage(change.value.messages[0]);
                    }
                }
            }
            return res.sendStatus(200);
        }

        // Handle outgoing messages
        const { type, parameters, customerMobile } = req.body;
        
        if (!type || !parameters || !customerMobile) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const mobileRegex = /^\d{12}$/;
        if (!mobileRegex.test(customerMobile)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid mobile number format'
            });
        }

        let response;
        switch (type) {
            // In the handleWebhook function, update the text message case:
            case 'text':
                if (!parameters.message) {
                    return res.status(400).json({
                        success: false,
                        message: 'Message text is required'
                    });
                }
                try {
                    response = await whatsappService.sendTextMessage(
                        customerMobile,
                        parameters.message
                    );
                    
                    return res.json({
                        success: true,
                        message: 'Message sent successfully',
                        data: response
                    });
                } catch (error) {
                    logger.error('Error sending text message:', error);
                    return res.status(error.status || 500).json({
                        success: false,
                        message: error.message || 'Failed to send message',
                        error: error.error || null
                    });
                }
                break;

            case 'image':
                response = await whatsappService.sendImageMessage(customerMobile, parameters.image);
                break;

            case 'video':
                response = await whatsappService.sendVideoMessage(customerMobile, parameters.video);
                break;

            case 'audio':
                response = await whatsappService.sendAudioMessage(customerMobile, parameters.audio);
                break;

            case 'document':
                response = await whatsappService.sendDocumentMessage(customerMobile, parameters.document);
                break;

            case 'sticker':
                response = await whatsappService.sendStickerMessage(customerMobile, parameters.sticker);
                break;

            case 'location':
                response = await whatsappService.sendLocationMessage(customerMobile, parameters.location);
                break;

            case 'interactive':
                if (parameters.interactiveType === 'button') {
                    response = await whatsappService.sendButtonMessage(customerMobile, parameters.button);
                } else if (parameters.interactiveType === 'list') {
                    response = await whatsappService.sendListMessage(customerMobile, parameters.list);
                }
                break;

            case 'template':
                response = await whatsappService.sendTemplateMessage(
                    customerMobile,
                    parameters.template_name,
                    parameters.language.code,
                    parameters.components || []
                );
                break;

            case 'reaction':
                response = await whatsappService.sendReactionMessage(customerMobile, parameters.reaction);
                break;

            case 'contacts':
                response = await whatsappService.sendContactsMessage(customerMobile, parameters.contacts);
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Unsupported message type'
                });
        }

        logger.info('Message sent successfully', { type, customerMobile });
        res.json({
            success: true,
            message: 'Message sent successfully',
            data: response
        });

    } catch (error) {
        logger.error('Error in webhook handler:', error);
        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                message: error.response.data.error.message || 'WhatsApp API error'
            });
        }
        next(error);
    }
};

async function handleIncomingMessage(message) {
    try {
        const messageType = message.type;
        const from = message.from;
        
        switch (messageType) {
            case 'text':
                logger.info('Received text message', { from, text: message.text.body });
                break;
            case 'image':
                logger.info('Received image message', { from, image: message.image });
                break;
            case 'video':
                logger.info('Received video message', { from, video: message.video });
                break;
            case 'audio':
                logger.info('Received audio message', { from, audio: message.audio });
                break;
            case 'document':
                logger.info('Received document message', { from, document: message.document });
                break;
            case 'sticker':
                logger.info('Received sticker message', { from, sticker: message.sticker });
                break;
            case 'location':
                logger.info('Received location message', { from, location: message.location });
                break;
            case 'interactive':
                logger.info('Received interactive message', { 
                    from, 
                    type: message.interactive.type,
                    data: message.interactive 
                });
                break;
            case 'reaction':
                logger.info('Received reaction message', { from, reaction: message.reaction });
                break;
            case 'contacts':
                logger.info('Received contacts message', { from, contacts: message.contacts });
                break;
            default:
                logger.info('Received unsupported message type', { from, type: messageType });
        }
    } catch (error) {
        logger.error('Error processing incoming message:', error);
    }
}

const verifyWebhook = (req, res) => {
    try {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (!mode || !token) {
            return res.status(400).json({
                success: false,
                message: 'Missing required query parameters'
            });
        }

        if (mode === 'subscribe' && token === whatsappConfig.webhookVerifyToken) {
            logger.info('Webhook verified successfully');
            return res.status(200).send(challenge);
        }

        logger.warn('Webhook verification failed');
        return res.sendStatus(403);
    } catch (error) {
        logger.error('Error in webhook verification:', error);
        return res.sendStatus(500);
    }
};

module.exports = {
    handleWebhook,
    verifyWebhook
};

