const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3');
const multerS3 = require('multer-s3');
const path = require('path');
const fs = require('fs');

// Check if we should use S3 or local storage
// Check for necessary AWS credentials - must be present and non-empty
const useS3 = process.env.AWS_BUCKET_NAME &&
              process.env.AWS_BUCKET_NAME.trim() !== '' &&
              process.env.AWS_ACCESS_KEY_ID &&
              process.env.AWS_ACCESS_KEY_ID.trim() !== '' &&
              process.env.AWS_SECRET_ACCESS_KEY &&
              process.env.AWS_SECRET_ACCESS_KEY.trim() !== '' &&
              process.env.AWS_REGION &&
              process.env.AWS_REGION.trim() !== '';

// Configure AWS SDK v3 - only create if credentials are properly configured
let s3Client = null;
if (useS3) {
  try {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      requestTimeout: 300000 // 5 minutes timeout
    });
    console.log('S3 Client created successfully');
  } catch (error) {
    console.error('Error creating S3 client:', error.message);
    console.log('Falling back to local file storage');
    s3Client = null;
  }
} else {
  console.log('AWS credentials not fully configured - using local storage');
}

// Configure storage
let storage;

if (useS3 && s3Client) {
  console.log('Using S3 storage for file uploads with AWS SDK v3');
  storage = multerS3({
    s3: s3Client,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const folder = file.fieldname === 'paymentScreenshot' ? 'payment-screenshots/' : 'uploads/';
      const filename = folder + uniqueSuffix + path.extname(file.originalname);
      cb(null, filename);
    }
  });
} else {
  console.log('Using local storage for file uploads - AWS credentials not properly configured');
  console.log('Required AWS credentials: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_BUCKET_NAME');

  // Create uploads directory if it doesn't exist
  const uploadDir = path.join(__dirname, '../../public/uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// File filter function
const fileFilter = (req, file, cb) => {
  // Accept images and PDFs only
  if (file.fieldname === 'photo') {
    // Only allow image files for photos
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files (jpg, png) are allowed for photos!'), false);
    }
    cb(null, true);
  } else if (file.fieldname === 'idProof') {
    // Accept images and PDFs for ID proof
    if (!file.mimetype.startsWith('image/') && file.mimetype !== 'application/pdf') {
      return cb(new Error('Only images and PDF files are allowed for ID proof!'), false);
    }
    cb(null, true);
  } else if (file.fieldname === 'paymentScreenshot') {
    // Accept common image formats and PDFs for payment screenshots
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf'
    ];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      return cb(new Error('Payment screenshot must be an image (JPG, PNG, GIF, WEBP) or PDF file!'), false);
    }
  } else {
    // For other fields, accept images and PDFs
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDF files are allowed!'), false);
    }
  }
};

// Create multer upload instance
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  }
});

// Middleware to handle local file URLs
const handleLocalFileUrls = (req, res, next) => {
  if ((!useS3 || !s3Client) && req.files) {
    // For each file field
    Object.keys(req.files).forEach(fieldName => {
      req.files[fieldName].forEach(file => {
        // Add server URL to file path
        const baseUrl = process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`;
        file.location = `${baseUrl}/uploads/${file.filename}`;
      });
    });
  }
  next();
};

// Log the current S3 configuration status for debugging
console.log('=== S3 CONFIG STATUS (middleware/uploadToS3.js) ===');
console.log('Using S3:', useS3 && s3Client ? true : false);
if (useS3 && s3Client) {
  console.log('AWS Region:', process.env.AWS_REGION);
  console.log('AWS Bucket:', process.env.AWS_BUCKET_NAME);
  console.log('AWS Access Key ID: configured');
  console.log('AWS Secret Access Key: configured');
} else {
console.log('AWS Region:', process.env.AWS_REGION || 'not set');
console.log('AWS Bucket:', process.env.AWS_BUCKET_NAME || 'not set');
  console.log('AWS Access Key ID:', process.env.AWS_ACCESS_KEY_ID ? (process.env.AWS_ACCESS_KEY_ID.trim() !== '' ? 'configured' : 'empty string') : 'not set');
  console.log('AWS Secret Access Key:', process.env.AWS_SECRET_ACCESS_KEY ? (process.env.AWS_SECRET_ACCESS_KEY.trim() !== '' ? 'configured' : 'empty string') : 'not set');
  console.log('Reason: Using local file storage');
}

module.exports = {
  upload,
  handleLocalFileUrls,
  useS3,
  s3Client
};