import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import * as nodemailer from 'nodemailer';

@Module({
  providers: [
    NotificationsService,
    {
      provide: 'MAILER',
      useFactory: async () => {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: parseInt(process.env.SMTP_PORT || '1025', 10),
          secure: process.env.SMTP_SECURE === 'true', // true لـ port 465, false لـ 587
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          logger: true,
          debug: true,
        });
        await transporter.verify().then(() => {
          console.log('SMTP connection is ready');
        }).catch((error) => {
          console.error('SMTP connection failed:', error);
        });
        return transporter;
      },
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}