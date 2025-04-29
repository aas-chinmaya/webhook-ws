# whatsapp-webhook
WhatsApp Manager Phone numbers



1. **Project Structure**: This project is now compatible with Vercel serverless functions. The main webhook endpoint is located at `api/webhook.js`.
2. **Environment Variables**: Set the following environment variables in your Vercel dashboard:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_WEBHOOK_VERIFY_TOKEN`
3. **Deploy**: Push your code to a Git repository (GitHub, GitLab, or Bitbucket) and import the project into Vercel. Vercel will automatically detect the API route and deploy it.
4. **API Endpoints**:
   - `POST /api/webhook` — WhatsApp webhook receiver
   - `GET /api/webhook` — WhatsApp webhook verification
   - `GET /api/webhook/health` — Health check

## WhatsApp Webhook Setup

1. In your [Facebook App Dashboard](https://developers.facebook.com/apps/), set the webhook callback URL to:
   - `https://<your-vercel-domain>/api/webhook`
2. Set the verify token to match your `WHATSAPP_WEBHOOK_VERIFY_TOKEN` environment variable.
3. Subscribe to the required webhook events (messages, status, etc.).

## Local Development

- Run `npm install` to install dependencies.
- Use `npm run dev` to start the server locally (Express mode).
- For Vercel emulation, use `vercel dev` if you have the Vercel CLI installed.

## Notes
- All sensitive credentials should be managed via environment variables.
- The webhook endpoint is secured with validation and rate limiting.
- For production, ensure your Vercel project is set to use Node.js 18+ runtime.
