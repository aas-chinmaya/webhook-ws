const whatsappConfig = {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN,
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN
};

// Validate configuration
if (!whatsappConfig.accessToken || !whatsappConfig.phoneNumberId) {
    throw new Error('WhatsApp configuration is incomplete. Please check your environment variables.');
}

module.exports = whatsappConfig;