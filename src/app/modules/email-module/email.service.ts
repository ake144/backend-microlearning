import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('EMAIL_HOST') || 'smtp.gmail.com',
      port: this.configService.get<number>('EMAIL_PORT') || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('EMAIL_USER'),
        pass: this.configService.get<string>('EMAIL_PASS'),
      },
      tls: {
          rejectUnauthorized: false
      }
    });
  }

  async sendPasswordResetEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3001';
    const resetLink = `${frontendUrl}/auth/reset-password?token=${token}`;
    
    const mailOptions = {
      from: `"Global Pathways Academy" <${this.configService.get<string>('EMAIL_FROM') || 'noreply@example.com'}>`,
      to,
      subject: 'Password Reset Request',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your Global Pathways Academy account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background-color: #2563EB; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
          </div>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p style="color: #666; font-size: 14px; word-break: break-all;">${resetLink}</p>
          <p>If you did not request this, please ignore this email. Your password will remain unchanged.</p>
          <p>This link is valid for 1 hour.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">Global Pathways Academy Team</p>
        </div>
      `,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }
}
