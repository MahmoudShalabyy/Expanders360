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
          host: 'localhost',
          port: 1025,
          secure: false,
          ignoreTLS: true,
          logger: true, // لتفعيل Logging
          debug: true, // لعرض التفاصيل
        });
        // اختبار الاتصال
        await transporter.verify().then(() => {
          console.log('Mailhog connection is ready');
        }).catch((error) => {
          console.error('Mailhog connection failed:', error);
        });
        return transporter;
      },
    },
  ],
  exports: [NotificationsService],
})
export class NotificationsModule {}