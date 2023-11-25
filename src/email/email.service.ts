// email.service.ts

import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  async sendMail(token) {
    var transporter = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "5a8b0ae367c401",
          pass: "77805948ece148"
        }
      });

    const mailOptions = {
      from: '7ayyanar49@gmail.com',
      to: '7ayyanar49@gmail.com',
      subject: 'Test Email',
      text: token,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
