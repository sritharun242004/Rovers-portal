const crypto = require('crypto');
const User = require('../models/User');
const EmailService = require('../utils/email');

class OTPService {
  static async generateAndSendOTP(email) {
    try {
      // Find the user by email
      const user = await User.findOne({ email });

      if (!user) {
        console.error(`User not found with email: ${email}`);
        throw new Error('User not found');
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      // Save OTP to user record with expiration (10 minutes)
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      console.log(`OTP generated for user: ${email}`);

      // Send OTP via email
      await EmailService.sendEmail(
        email, 
        user.name, 
        "Login OTP for Rovers",
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Your One-Time Password</h2>
          <p>Use the following OTP to complete your login process:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; color: #777;">This OTP is valid for 10 minutes.</p>
          <p style="color: #777;">If you didn't request this OTP, please ignore this email.</p>
        </div>`
      );

      return { success: true };
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw new Error(`Failed to generate OTP: ${error.message}`);
    }
  }

  // Generate and send OTP for signup (no user record yet)
  static async generateAndSendOTPForSignup(email) {
    try {
      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      console.log(`Generating signup OTP for email: ${email}`);

      // Look for an existing temporary user
      let tempUser = await User.findOne({ email });

      if (!tempUser) {
        console.log(`Creating temporary user for signup: ${email}`);
        tempUser = new User({
          email,
          name: 'Temporary User',
          role: 'parent', // Default role, will be updated later
          isActive: false, // Mark as inactive until signup is complete
          password: 'temporary' // Will be updated during final registration
        });
      }

      // Save OTP to temporary user record with expiration (10 minutes)
      tempUser.otp = otp;
      tempUser.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await tempUser.save();

      // Send OTP via email
      await EmailService.sendEmail(
        email,
        tempUser.name || 'User',
        "Signup OTP for Rovers",
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Your One-Time Password</h2>
          <p>Use the following OTP to complete your signup process:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; color: #777;">This OTP is valid for 10 minutes.</p>
          <p style="color: #777;">If you didn't request this OTP, please ignore this email.</p>
        </div>`
      );
      console.log(`Signup OTP sent to: ${email}`);

      return { success: true };
    } catch (error) {
      console.error('Error generating signup OTP:', error);
      throw new Error(`Failed to generate signup OTP: ${error.message}`);
    }
  }

  static async generateSignupOTP(email) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        console.log(`User already exists with email: ${email}`);
        throw new Error('User with this email already exists');
      }

      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      console.log(`Generated signup OTP for email: ${email}`);

      // Store OTP in a temporary collection or session
      // For this implementation, we'll store it in a temporary user object without validation
      const tempUser = new User({
        email,
        name: 'Temporary', // Will be updated later
        role: 'temporary', // Will be updated later
        otp,
        otpExpires: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
      });

      // Save without validation since we're missing required fields
      console.log(`Saving temporary user without validation for: ${email}`);
      await tempUser.save({ validateBeforeSave: false });

      // Send OTP email
      // Here's the fix - use sendEmail instead of sendOTPEmail
      await EmailService.sendEmail(
        email,
        'Temporary',
        "Signup OTP for Rovers",
        `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #333;">Your One-Time Password</h2>
          <p>Use the following OTP to complete your signup process:</p>
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; border-radius: 5px;">
            ${otp}
          </div>
          <p style="margin-top: 20px; color: #777;">This OTP is valid for 10 minutes.</p>
          <p style="color: #777;">If you didn't request this OTP, please ignore this email.</p>
        </div>`
      );
      console.log(`Signup OTP email sent to: ${email}`);

      return true;
    } catch (error) {
      console.error('Error generating signup OTP:', error);
      throw new Error(`Failed to generate signup OTP: ${error.message}`);
    }
  }

  static async verifyOTP(email, otp) {
    try {
      // Find user by email
      const user = await User.findOne({ email });

      if (!user) {
        console.error(`User not found with email: ${email}`);
        throw new Error('User not found');
      }

      // Check if OTP matches and has not expired
      if (!user.otp || user.otp !== otp) {
        console.error(`Invalid OTP provided for ${email}`);
        throw new Error('Invalid OTP');
      }

      if (!user.otpExpires || user.otpExpires < new Date()) {
        console.error(`Expired OTP provided for ${email}. Expired at ${user.otpExpires}`);
        throw new Error('OTP has expired');
      }

      // Clear OTP after successful verification
      user.otp = null;
      user.otpExpires = null;
      user.lastLoginAt = new Date();
      await user.save();

      console.log(`OTP verified successfully for: ${email}`);
      return { success: true, user };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      throw new Error(`Failed to verify OTP: ${error.message}`);
    }
  }

  // Verify OTP for signup (may not have active user yet)
  static async verifyOTPForSignup(email, otp) {
    try {
      console.log(`Verifying signup OTP for: ${email}`);

      // Find temporary user by email
      const tempUser = await User.findOne({ email });

      if (!tempUser) {
        console.error(`No verification in progress for email: ${email}`);
        throw new Error('No verification in progress for this email');
      }

      // Check if OTP matches and has not expired
      if (!tempUser.otp || tempUser.otp !== otp) {
        console.error(`Invalid signup OTP provided for ${email}`);
        throw new Error('Invalid OTP');
      }

      if (!tempUser.otpExpires || tempUser.otpExpires < new Date()) {
        console.error(`Expired signup OTP provided for ${email}. Expired at ${tempUser.otpExpires}`);
        throw new Error('OTP has expired');
      }

      // Clear OTP after successful verification
      tempUser.otp = null;
      tempUser.otpExpires = null;
      await tempUser.save();

      console.log(`Signup OTP verified successfully for: ${email}`);
      return { success: true };
    } catch (error) {
      console.error('Error verifying signup OTP:', error);
      throw new Error(`Failed to verify signup OTP: ${error.message}`);
    }
  }
}

module.exports = OTPService;