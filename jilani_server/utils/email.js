require('dotenv').config();
const nodemailer = require("nodemailer");

class EmailService {
  static async createTransporter() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: "roversgwruae@gmail.com",
        pass: process.env.GMAIL_PASSWORD, // Use environment variable for security
      },
    });
  }

  static async sendOTP(email, name, otp) {
    try {
      const transporter = await this.createTransporter();
      const info = await transporter.sendMail({
        from: '"Rovers" <roversgwruae@gmail.com>',
        to: email,
        subject: "Your Login OTP Code",
        html: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Login Verification</h2>
          <p>Hello${name ? ' ' + name : ''},</p>
          <p>Your One-Time Password (OTP) for login is:</p>
          <h1 style="font-size: 32px; letter-spacing: 5px; text-align: center; margin: 30px 0; padding: 10px; background-color: #f5f5f5; border-radius: 5px;">${otp}</h1>
          <p>This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          <p>If you did not request this code, please ignore this email.</p>
        </div>`,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  // Add a new method for sending general emails
  static async sendEmail(email, name, subject, htmlContent) {
    try {
      const transporter = await this.createTransporter();
      const info = await transporter.sendMail({
        from: '"Rovers" <roversgwruae@gmail.com>',
        to: email,
        subject: subject,
        html: htmlContent,
      });
      return { success: true, messageId: info.messageId };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  static async sendParentPaymentNotification(parentEmails, studentNames, eventName, sportName, schoolName) {
    try {
      const transporter = await this.createTransporter();
      const subject = `Payment Required - ${sportName} Registration for ${eventName}`;

      const studentList = studentNames.length > 1
        ? studentNames.slice(0, -1).join(', ') + ' and ' + studentNames[studentNames.length - 1]
        : studentNames[0];

      const html = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #4f46e5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background-color: #f9f9f9; }
        .button { 
            display: inline-block; 
            background-color: #4f46e5; 
            color: white; 
            padding: 12px 24px; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
        }
        .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        .highlight { background-color: #fef3c7; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Payment Required - Registration Confirmation</h1>
        </div>
        
        <div class="content">
            <p><strong>Dear Parent,</strong></p>
            
            <p><strong>${schoolName}</strong> has registered <strong>${studentList}</strong> for <strong>${sportName}</strong> in the event <strong>"${eventName}"</strong>.</p>
            
            <div class="highlight">
                <p><strong>Action Required:</strong> To complete the registration, please make the payment by logging into your account.</p>
            </div>
            
            <p style="text-align: center;">
                <a href="https://rovers.life/login" class="button">📋 Complete Payment & View Registration</a>
            </p>
            
            <p>Once logged in, you can:</p>
            <ul>
                <li>View the registration details</li>
                <li>See the payment amount</li>
                <li>Complete the payment process securely</li>
            </ul>
            
            <p>If you don't have an account, you can create one using the same link above.</p>
        </div>
        
        <div class="footer">
            <p>Thank you,<br><strong>Rovers Life Team</strong></p>
            <p>This is an automated email. Please do not reply to this message.</p>
        </div>
    </div>
</body>
</html>
      `;

      // Send email to all parent emails
      for (const email of parentEmails) {
        await transporter.sendMail({
          from: "roversgwruae@gmail.com",
          to: email,
          subject: subject,
          html: html
        });
      }

      console.log(`Parent payment notification sent to ${parentEmails.length} email(s)`);
    } catch (error) {
      console.error('Error sending parent payment notification:', error);
      throw new Error('Failed to send parent payment notification');
    }
  }
}

module.exports = EmailService;