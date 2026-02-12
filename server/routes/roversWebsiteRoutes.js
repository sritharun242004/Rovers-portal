const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create transporter for Rovers website forms
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.ROVERS_GMAIL_USER || 'roversmalaysia@gmail.com',
            pass: process.env.ROVERS_GMAIL_APP_PASSWORD
        }
    });
};

// Email template generator
const generateEmailHTML = (formData, formType) => {
    const getFormTitle = () => {
        switch (formType) {
            case 'contact': return 'Contact Form Submission';
            case 'partners': return `${formData.formType} Partnership Inquiry`;
            case 'academy': return 'Academy Sponsorship Inquiry';
            default: return 'Form Submission';
        }
    };

    const getFormFields = () => {
        let fields = [];

        if (formType === 'contact') {
            fields = [
                { label: 'Full Name', value: formData.name },
                { label: 'Email', value: formData.email },
                { label: 'Phone', value: formData.phone || 'Not provided' },
                { label: 'Country', value: formData.country },
                { label: 'State/Region', value: formData.state },
                { label: 'User Type', value: formData.userType },
                { label: 'Sport of Interest', value: formData.sport },
                { label: 'Message', value: formData.message }
            ];
        } else if (formType === 'partners') {
            fields = [
                { label: 'Name', value: formData.name },
                { label: 'Email', value: formData.email },
                { label: 'Phone', value: formData.phone },
                { label: 'Country', value: formData.country },
                { label: 'State/Region', value: formData.state },
                { label: 'Form Type', value: formData.formType }
            ];

            if (formData.businessName) {
                fields.push({ label: 'Business/Organization', value: formData.businessName });
            }
            if (formData.sportCategory) {
                fields.push({ label: 'Sport Specialization', value: formData.sportCategory });
            }

            fields.push({ label: 'Message', value: formData.message });
        } else if (formType === 'academy') {
            fields = [
                { label: 'Full Name', value: formData.fullName },
                { label: 'Email', value: formData.email },
                { label: 'Business Name', value: formData.businessName },
                { label: 'Phone', value: formData.phone },
                { label: 'Country', value: formData.country },
                { label: 'State/Region', value: formData.state },
                { label: 'Message', value: formData.message }
            ];
        }

        return fields;
    };

    const fields = getFormFields();
    const submissionDate = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Kuala_Lumpur',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #3b82f6 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 20px; }
    table { width: 100%; border-collapse: collapse; background: white; margin: 15px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    th { background: #10b981; color: white; padding: 12px; text-align: left; font-weight: 600; }
    td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
    tr:last-child td { border-bottom: none; }
    .label { font-weight: 600; color: #4b5563; width: 40%; }
    .value { color: #1f2937; }
    .footer { background: #1f2937; color: #9ca3af; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px; }
    .form-name-box { background: #1f2937; color: white; padding: 15px; border-radius: 8px; margin: 15px 0; text-align: center; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🏆 ROVERS INTERNATIONAL SCHOOLS GAMES</h1>
      <p style="margin: 10px 0 0 0;">New ${getFormTitle()}</p>
    </div>
    
    <div class="content">
      <div class="form-name-box">
        📧 ${getFormTitle()}
      </div>

      <table>
        <tr>
          <th colspan="2">👤 Contact Information</th>
        </tr>
        ${fields.map(field => `
          <tr>
            <td class="label">${field.label}:</td>
            <td class="value">${field.value}</td>
          </tr>
        `).join('')}
      </table>

      <table>
        <tr>
          <th colspan="2">📅 Submission Details</th>
        </tr>
        <tr>
          <td class="label">Submitted On:</td>
          <td class="value">${submissionDate} (Malaysia Time)</td>
        </tr>
        <tr>
          <td class="label">Form Type:</td>
          <td class="value">${getFormTitle()}</td>
        </tr>
      </table>
    </div>
    
    <div class="footer">
      <p style="margin: 0;">This inquiry was submitted through the Rovers International Schools Games website.</p>
      <p style="margin: 5px 0 0 0;">⏱️ We will respond as soon as possible</p>
    </div>
  </div>
</body>
</html>
  `;
};

// Route to handle Rovers website form submissions
router.post('/send-email', async (req, res) => {
    try {
        const { formData, formType } = req.body;

        if (!formData || !formType) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields'
            });
        }

        const transporter = createTransporter();

        const recipientEmail = process.env.ROVERS_FORM_RECIPIENT_EMAIL || 'jeelu@rovers.life';

        const mailOptions = {
            from: process.env.ROVERS_GMAIL_USER || 'roversmalaysia@gmail.com',
            to: recipientEmail,
            subject: `Rovers Website - ${formType === 'contact' ? 'Contact' : formType === 'partners' ? 'Partnership' : 'Academy'} Form Submission`,
            html: generateEmailHTML(formData, formType),
            replyTo: formData.email || formData.email
        };

        const info = await transporter.sendMail(mailOptions);

        console.log('Rovers form email sent successfully:', info.messageId);

        res.json({
            success: true,
            message: 'Email sent successfully',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending Rovers form email:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send email',
            error: error.message
        });
    }
});

// Health check endpoint for Rovers website forms
router.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Rovers Website Email Service is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;

