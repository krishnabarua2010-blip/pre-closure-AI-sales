import twilio from 'twilio';
import dotenv from 'dotenv';
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_token';
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';

let client: any = null;
if (process.env.TWILIO_ACCOUNT_SID) {
  client = twilio(accountSid, authToken);
}

export class TwilioService {
  static async sendWhatsAppMessage(to: string, message: string) {
    if (!client) {
      console.warn('[TwilioService] Twilio not configured. Mocking WhatsApp message to:', to);
      return { sid: 'mock_sid', status: 'mock_sent' };
    }

    try {
      const response = await client.messages.create({
        body: message,
        from: twilioNumber,
        to: `whatsapp:${to}`,
      });

      console.log(`[TwilioService] WhatsApp sent to ${to}, SID: ${response.sid}`);
      return response;
    } catch (error) {
      console.error(`[TwilioService] Failed to send WhatsApp message to ${to}:`, error);
      throw error;
    }
  }
}
