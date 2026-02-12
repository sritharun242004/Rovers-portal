const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const requireUser = async (req, res, next) => {
  try {
    // Get token from authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Authentication failed: No token provided or invalid format');
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please login.'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by id (JWT uses 'sub' field, not 'id')
    const user = await User.findById(decoded.sub).select('-password');

    if (!user) {
      console.log('Authentication failed: User not found for token', {
        userId: decoded.sub,
        tokenPayload: decoded,
        timestamp: new Date().toISOString()
      });
      return res.status(401).json({
        success: false,
        message: 'User not found or invalid session. Please login again.'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token : Please logout and login again.'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please login again.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

module.exports = requireUser;