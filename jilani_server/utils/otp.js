/**
 * Generates a 6-digit OTP
 * @returns {string} A 6-digit OTP
 */
function generateOTP() {
  // Generate a 6-digit OTP
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  generateOTP
}; 