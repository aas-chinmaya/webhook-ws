const { handleWebhook, verifyWebhook } = require('../controllers/webhookController');
const validateRequest = require('../middleware/validateRequest');
const validateWebhook = require('../middleware/validateWebhook');
const rateLimiter = require('../middleware/rateLimiter');

// Vercel serverless API handler
module.exports = async (req, res) => {
  // Health check
  if (req.method === 'GET' && req.url === '/api/webhook/health') {
    return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
  }

  // Webhook verification (GET)
  if (req.method === 'GET') {
    // Apply rate limiter and verification
    await rateLimiter(req, res, async () => {
      await verifyWebhook(req, res);
    });
    return;
  }

  // Webhook handler (POST)
  if (req.method === 'POST') {
    await rateLimiter(req, res, async () => {
      await validateWebhook(req, res, async () => {
        await validateRequest(req, res, async () => {
          await handleWebhook(req, res);
        });
      });
    });
    return;
  }

  // Method not allowed
  res.status(405).json({ success: false, message: 'Method Not Allowed' });
};