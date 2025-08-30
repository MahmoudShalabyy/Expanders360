import { Injectable, Inject } from '@nestjs/common';
import { Transporter } from 'nodemailer';

@Injectable()
export class NotificationsService {
  constructor(@Inject('MAILER') private readonly mailer: Transporter) {
    console.log('NotificationsService initialized with transporter:', this.mailer);
  }

  async sendMatchNotification(projectName: string, vendorName: string, email: string) {
    console.log('Attempting to send email to:', email, 'with transporter:', this.mailer);
    try {
      const info = await this.mailer.sendMail({
        from: '"Expanders360" <no-reply@expanders360.com>',
        to: email,
        subject: 'New Match Created',
        text: `A new match has been created between project "${projectName}" and vendor "${vendorName}".`,
        html: `<p>A new match has been created between project <strong>${projectName}</strong> and vendor <strong>${vendorName}</strong>.</p>`,
      });
      console.log('Email sent successfully. Response:', info.response);
      return info;
    } catch (error) {
      console.error('Failed to send email:', error.message, 'Stack:', error.stack);
      throw error; // لنظهر الخطأ في الـ Terminal
    }
  }
}