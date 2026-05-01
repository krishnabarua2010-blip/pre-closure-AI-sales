import { Resend } from 'resend';
import dotenv from 'dotenv';
dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export class ResendService {
  static async sendOutreachEmail(to: string, subject: string, htmlContent: string) {
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
    } catch (error) {
      console.error(`[ResendService] Failed to send email to ${to}:`, error);
      throw error;
    }
  }
}
