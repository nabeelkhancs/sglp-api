// EmailService for sending emails using nodemailer
// Make sure to install nodemailer: npm install nodemailer
import nodemailer from 'nodemailer';

class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
      html,
    };
    return this.transporter.sendMail(mailOptions);
  }

  async sendTemplateMail(to: string, subject: string, template: string, variables: Record<string, any>) {
    // Simple template replacement: {{variable}}
    let html = template;
    for (const key in variables) {
      html = html.replace(new RegExp(`{{${key}}}`, 'g'), variables[key]);
    }
    return this.sendMail(to, subject, '', html);
  }
}

export default new EmailService();
