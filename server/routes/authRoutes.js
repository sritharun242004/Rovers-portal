const express = require('express');
const UserService = require('../services/userService.js');
const OTPService = require('../services/otpService.js');
const { requireUser } = require('./middleware/auth.js');
const { generateAccessToken, generateRefreshToken } = require('../utils/auth.js');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const Sport = require('../models/Sport.js'); // Import Sport model
const EmailService = require('../services/emailService.js');

const router = express.Router();

// Request OTP route
router.post('/request-otp', async (req, res,next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and send OTP
    await OTPService.generateAndSendOTP(email);
    return res.json({
      success: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    next(error);
    console.error('Request OTP error:', error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Verify OTP and login
router.post('/verify-otp', async (req, res,next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP
    const verification = await OTPService.verifyOTP(email, otp);
    const user = verification.user;

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save();
    return res.json({
      success: true,
      accessToken,
      refreshToken,
      role: user.role,
      checkpoint : user.checkpoint
    });
  } catch (error) {
    next(error);    
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Signup route - Step 1: Request OTP for signup
router.post('/signup/request-otp', async (req, res,next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Check if user already exists
    const checkTemporaryUser = await UserService.checkTemporarayUser(email);
    if(checkTemporaryUser){
      await UserService.delete(checkTemporaryUser._id)
    }
    const existingUser = await UserService.getByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Use generateSignupOTP instead which doesn't require full user validation
    await OTPService.generateSignupOTP(email);
    console.log(`OTP generation requested for signup: ${email}`);

    return res.json({
      success: true,
      message: 'OTP sent successfully'
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: `Failed to generate signup OTP: ${error.message}`
    });
  }
});

// Signup route - Step 2: Verify OTP and collect user details
router.post('/signup/verify-otp', async (req, res,next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required'
      });
    }

    // Verify OTP without requiring an existing user
    const verification = await OTPService.verifyOTPForSignup(email, otp);

    return res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  } catch (error) {
    next(error);
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
});

// Signup route - Step 3: Complete registration with user details
router.post('/signup/complete', async (req, res,next) => {
  try {
    const userData = req.body;
    console.log(userData)

    if (!userData.email || !userData.role || !userData.name) {
      return res.status(400).json({
        success: false,
        message: 'Email, role, and name are required'
      });
    }

    // Validate role-specific required fields
    if (userData.role === 'parent') {
      if (!userData.phoneNumber || !userData.countryCode) {
        return res.status(400).json({
          success: false,
          message: 'Phone number and country code are required for parents'
        });
      }
    } else if (userData.role === 'school') {
      if (!userData.schoolType || !userData.contactPersonName ||
          !userData.contactPersonPhone || !userData.countryCode ||
          !userData.address || userData.provideVenue === undefined) {
        return res.status(400).json({
          success: false,
          message: 'All school details are required'
        });
      }
    }

    // Create the user
    const user = await UserService.create(userData);

    // Generate tokens for immediate login
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      user: user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

// Get available sports for school signup
router.get('/signup/sports', async (req, res,next) => {
  try {
    const sports = await Sport.find().lean();
    return res.json({
      success: true,
      sports
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Login route
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check for temporary user and delete if exists
    const tempUser = await UserService.checkTemporarayUser(email);
    if (tempUser) {
      await UserService.delete(tempUser._id);
    }

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await UserService.getByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // If password is provided, try password authentication
    if (password) {
      const authenticatedUser = await UserService.authenticateWithPassword(email, password);
      if (!authenticatedUser) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }

      // Generate tokens
      const accessToken = generateAccessToken(authenticatedUser);
      const refreshToken = generateRefreshToken(authenticatedUser);

      // Update refresh token using UserService
      await UserService.update(authenticatedUser._id, { refreshToken });

      // Ensure we have all required user data
      const userData = {
        _id: authenticatedUser._id,
        email: authenticatedUser.email,
        name: authenticatedUser.name,
        role: authenticatedUser.role || 'parent', // Default to parent if role is not set
        checkpoint: authenticatedUser.checkpoint || 'start' // Default to start if checkpoint is not set
      };

      return res.json({
        success: true,
        user: userData,
        accessToken,
        refreshToken,
        role: userData.role,
        checkpoint: userData.checkpoint
      });
    }

    // If no password or password authentication failed, proceed with OTP flow
    await OTPService.generateAndSendOTP(email);
    return res.json({
      success: true,
      requireOTP: true,
      message: 'OTP sent to your email'
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add new endpoint for password setup
router.post('/setup-password', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Email and password are required' 
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Set the password
    await UserService.setPassword(user, password);

    // Generate tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update user's refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      success: true,
      message: 'Password setup successful',
      user,
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
    return res.status(500).json({ 
      success: false,
      message: error.message || 'Internal server error' 
    });
  }
});

router.post('/register', async (req, res, next) => {
  if (req.user) {
    return res.json({ user: req.user });
  }

  try {
    const user = await UserService.create(req.body);
    return res.status(200).json({
      success: true,
      message: 'Registration successful',
      user
    });
  } catch (error) {
    next(error)
    return res.status(400).json({
      success: false,
      message: error.message || 'Registration failed'
    });
  }
});

router.post('/logout', async (req, res,next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (user) {
    user.refreshToken = null;
    await user.save();
  }

  res.status(200).json({ message: 'User logged out successfully.' });
});

router.post('/refresh', async (req, res,next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify the refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find the user
    const user = await UserService.get(decoded._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Update user's refresh token in database
    user.refreshToken = newRefreshToken;
    await user.save();

    // Return new tokens
    return res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken
      }
    });

  } catch (error) {
    next(error);

    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({
        success: false,
        message: 'Refresh token has expired'
      });
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid refresh token'
    });
  }
});

router.get('/me', requireUser, async (req, res) => {
  return res.status(200).json(req.user);
});

// Validate email route
router.post('/validate-email', async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log('Validating email:', email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    // Find user
    const user = await UserService.getByEmail(email);
    console.log('Found user:', user);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if user has password set
    const hasPassword = !!user.password;

    // Return success with user data
    return res.json({
      success: true,
      message: 'Email is valid',
      user: {
        email: user.email,
        role: user.role,
        name: user.name
      },
      hasPassword
    });
  } catch (error) {
    console.error('Email validation error:', error);
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error validating email'
    });
  }
});

// Reset password route
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, OTP, and password are required'
      });
    }

    // Find user first
    const user = await UserService.getByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify OTP
    const verification = await OTPService.verifyOTP(email, otp);
    if (!verification.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Set the new password
    await UserService.setPassword(user, password);

    // Generate new tokens
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // Update user's refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      success: true,
      message: 'Password reset successful',
      accessToken,
      refreshToken
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Error resetting password'
    });
  }
});

module.exports = router;