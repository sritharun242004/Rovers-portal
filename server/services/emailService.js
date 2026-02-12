const nodemailer = require('nodemailer');

class EmailService {
  static async sendEmail(to, subject, text, html) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        }
      });

      const mailOptions = {
        from: process.env.SMTP_FROM,
        to,
        subject,
        text,
        html
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error('Failed to send email');
    }
  }

  static async sendParentPaymentNotification(parentEmails, studentNames, eventName, sportName, schoolName) {
    try {
      const subject = `Payment Required - ${sportName} Registration for ${eventName}`;

      const studentList = studentNames.length > 1
        ? studentNames.slice(0, -1).join(', ') + ' and ' + studentNames[studentNames.length - 1]
        : studentNames[0];

      const text = `
Dear Parent,

${schoolName} has registered ${studentList} for ${sportName} in the event "${eventName}".

To complete the registration, please make the payment by logging into your account at:
https://rovers.life/login

Once logged in, you can view the registration details and complete the payment process.

If you don't have an account, you can create one using the same link.

Thank you,
Rovers Life Team
      `.trim();

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
                <a href="https://rovers.life/login" class="button">Complete Payment</a>
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
      `.trim();

      // Send email to all parent emails
      for (const email of parentEmails) {
        await this.sendEmail(email, subject, text, html);
      }

      console.log(`Parent payment notification sent to ${parentEmails.length} email(s)`);
    } catch (error) {
      console.error('Error sending parent payment notification:', error);
      throw new Error('Failed to send parent payment notification');
    }
  }
}

module.exports = EmailService; 