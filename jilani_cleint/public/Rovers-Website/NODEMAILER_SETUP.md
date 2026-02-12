# 📧 Nodemailer Setup Guide - Rovers Sports Academy

## 🎯 **Overview**
All form submissions now use Nodemailer to send emails directly to **jeelu@rovers.life** instead of using third-party services.

## 🔧 **Setup Instructions**

### **Step 1: Configure Gmail App Password**

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Sign in with: `roversmalaysia@gmail.com`

2. **Enable 2-Factor Authentication**
   - Go to "Security" tab
   - Click "2-Step Verification"
   - Follow the setup process

3. **Generate App Password**
   - In Security tab, find "App passwords"
   - Select "Mail" as the app
   - Copy the generated 16-character password

4. **Create Environment File**
   ```bash
   # Copy the example file
   cp env.example .env
   
   # Edit .env file and add your app password
   GMAIL_APP_PASSWORD=your_16_character_app_password_here
   PORT=3001
   ```

### **Step 2: Start the Email Server**

```bash
# Start both frontend and email server
npm run dev:full

# Or start them separately:
# Terminal 1: Email server
npm run server

# Terminal 2: Frontend
npm run dev
```

## 📨 **Email Configuration**

### **Email Recipient**
- **Primary**: `jeelu@rovers.life`
- **From**: `roversmalaysia@gmail.com`
- **Reply-To**: User's email address

### **Forms Updated**
1. **Contact Form** (`/contact`)
2. **Partners Forms** (`/partners`) - All 3 types
3. **Academy Sponsorship Form** (`/academy`)

## 🚀 **How It Works**

```
User fills form → Frontend → Email API (Port 3001) → Gmail SMTP → jeelu@rovers.life
```

### **Email Features**
- ✅ Professional HTML formatting
- ✅ Responsive email design
- ✅ Form-specific templates
- ✅ Automatic reply-to setup
- ✅ Malaysia timezone timestamps
- ✅ Backup mailto links on failure

## 🧪 **Testing**

### **Test Email Delivery**
1. Start the servers: `npm run dev:full`
2. Visit: http://localhost:5173/contact
3. Fill out the form with test data
4. Submit and check `jeelu@rovers.life` inbox

### **Health Check**
- Visit: http://localhost:3001/api/health
- Should return: `{"status":"OK","message":"Rovers Email Service is running"}`

## 🔒 **Security Notes**

- ✅ App password is stored in `.env` file (not committed to git)
- ✅ CORS enabled for localhost only
- ✅ Input validation on server side
- ✅ Error handling with fallback options

## 📋 **Troubleshooting**

### **Common Issues**

1. **"Invalid login" error**
   - Check if 2FA is enabled
   - Verify app password is correct
   - Ensure `.env` file exists and has correct format

2. **"Connection refused" error**
   - Make sure email server is running on port 3001
   - Check if port 3001 is available

3. **Emails not received**
   - Check spam folder
   - Verify Gmail account settings
   - Test with a different email address

### **Debug Commands**
```bash
# Check if email server is running
curl http://localhost:3001/api/health

# Check environment variables
node -e "require('dotenv').config(); console.log(process.env.GMAIL_APP_PASSWORD ? 'Password set' : 'Password missing')"
```

## 📞 **Support**

If you encounter issues:
1. Check the console logs in both terminals
2. Verify the `.env` file configuration
3. Test the health endpoint
4. Try the backup mailto functionality

---

**✅ All forms now send emails directly to jeelu@rovers.life using Nodemailer!**
