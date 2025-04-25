const axios = require('axios');
const whatsappConfig = require('../config/whatsapp');

class WhatsappService {
    constructor() {
        this.apiUrl = `https://graph.facebook.com/v17.0/${whatsappConfig.phoneNumberId}`;
        this.headers = {
            'Authorization': `Bearer ${whatsappConfig.accessToken}`,
            'Content-Type': 'application/json'
        };
        // Add default timeout
        this.timeout = 30000; // 30 seconds
    }

    async sendTextMessage(to, text) {
        try {
            const response = await axios.post(
                `${this.apiUrl}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: to,
                    type: "text",
                    text: {
                        body: text
                    }
                },
                { 
                    headers: this.headers,
                    timeout: this.timeout,
                    proxy: false // Disable proxy if you're not using one
                }
            );
            return response.data;
        } catch (error) {
            // Enhanced error handling
            const errorMessage = error.response?.data?.error?.message || error.message;
            const statusCode = error.response?.status;
            
            console.error('WhatsApp API Error:', {
                status: statusCode,
                message: errorMessage,
                details: error.response?.data
            });

            throw {
                success: false,
                status: statusCode || 500,
                message: errorMessage || 'Failed to send message',
                error: error.response?.data || error.message
            };
        }
    }

    async sendTemplateMessage(to, templateName, languageCode, components = []) {
        try {
            const payload = {
                messaging_product: "whatsapp",
                to,
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: languageCode
                    },
                    components: components
                }
            };

            const response = await axios.post(
                `${this.apiUrl}/messages`,
                payload,
                {
                    headers: this.headers,
                    timeout: this.timeout,
                    proxy: false
                }
            );

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error?.message || error.message;
            const statusCode = error.response?.status;

            console.error('WhatsApp API Error:', {
                status: statusCode,
                message: errorMessage,
                details: error.response?.data
            });

            throw {
                success: false,
                status: statusCode || 500,
                message: errorMessage || 'Failed to send template message',
                error: error.response?.data || error.message
            };
        }
    }
}

module.exports = new WhatsappService();