const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  try {
    if (!process.env.JWT_SECRET) {
      throw new Error('JWT secret key is not configured');
    }

    const payload = {
      sub: user._id,
      role: user.role
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET);
    return token;
  } catch (error) {
    throw error;
  }
};

const generateRefreshToken = (user) => {
  try {
    if (!process.env.REFRESH_TOKEN_SECRET) {
      throw new Error('Refresh token secret key is not configured');
    }

    const payload = {
      sub: user._id
    };

    const token = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return token;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken
};