/**
 * Middleware to handle local file URLs when running in development environment
 * This converts file paths to full URLs for files uploaded locally instead of S3
 */
const handleLocalFileUrls = (req, res, next) => {
  try {
    console.log('Processing file uploads in handleLocalFileUrls middleware');
    
    // Skip processing if there are no files
    if (!req.files) {
      console.log('No files detected in request');
      return next();
    }
    
    // Get the server's base URL (from environment or defaults)
    const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
    
    // For local development when using multer disk storage instead of S3
    // This adds a "location" property that mimics the S3 upload response
    Object.keys(req.files).forEach(fieldname => {
      req.files[fieldname].forEach(file => {
        // Only add location if it doesn't exist (not already processed by S3)
        if (!file.location && file.path) {
          // Convert file path to a URL
          // Replace backslashes with forward slashes for Windows compatibility
          const relativePath = file.path.replace(/\\/g, '/').replace(/^public\//, '');
          file.location = `${baseUrl}/${relativePath}`;
          console.log(`Converted local file path to URL: ${file.location}`);
        }
      });
    });
    
    console.log('Finished processing file uploads');
    next();
  } catch (error) {
    console.error('Error in handleLocalFileUrls middleware:', error);
    next(error);
  }
};

module.exports = handleLocalFileUrls;