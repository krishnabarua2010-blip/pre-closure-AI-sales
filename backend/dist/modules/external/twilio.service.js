"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID || 'AC_dummy';
const authToken = process.env.TWILIO_AUTH_TOKEN || 'dummy_token';
const twilioNumber = process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+14155238886';
let client = null;
if (process.env.TWILIO_ACCOUNT_SID) {
    client = (0, twilio_1.default)(accountSid, authToken);
}
class TwilioService {
    static async sendWhatsAppMessage(to, message) {
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
        }
        catch (error) {
            console.error(`[TwilioService] Failed to send WhatsApp message to ${to}:`, error);
            throw error;
        }
    }
}
exports.TwilioService = TwilioService;
