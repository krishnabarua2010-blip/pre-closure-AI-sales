"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendService = void 0;
const resend_1 = require("resend");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const resend = new resend_1.Resend(process.env.RESEND_API_KEY || 're_dummy_key');
class ResendService {
    static async sendOutreachEmail(to, subject, htmlContent) {
        if (!process.env.RESEND_API_KEY) {
            console.warn('[ResendService] No API key, mocking email to:', to);
            return { id: 'mock_email_id' };
        }
        try {
            const response = await resend.emails.send({
                from: process.env.EMAIL_FROM || 'outreach@yourcompany.com',
                to,
                subject,
                html: htmlContent,
            });
            console.log(`[ResendService] Email sent successfully to ${to}, ID: ${response.data?.id}`);
            return response.data;
        }
        catch (error) {
            console.error(`[ResendService] Failed to send email to ${to}:`, error);
            throw error;
        }
    }
}
exports.ResendService = ResendService;
