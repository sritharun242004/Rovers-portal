const { S3Client } = require('@aws-sdk/client-s3');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// For local development, use local file storage if no S3 bucket is configured
// Check that all required values are present and non-empty strings
const isS3Configured = process.env.AWS_BUCKET_NAME &&
                       process.env.AWS_BUCKET_NAME.trim() !== '' &&
                       process.env.AWS_ACCESS_KEY_ID &&
                       process.env.AWS_ACCESS_KEY_ID.trim() !== '' &&
                       process.env.AWS_SECRET_ACCESS_KEY &&
                       process.env.AWS_SECRET_ACCESS_KEY.trim() !== '' &&
                       process.env.AWS_REGION &&
                       process.env.AWS_REGION.trim() !== '';

// Configure AWS SDK v3 - only create if credentials are properly configured
let s3Client = null;
if (isS3Configured) {
  try {
    s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      },
      requestTimeout: 300000 // 5 minutes timeout for S3 operations
    });
  } catch (error) {
    console.error('Error creating S3 client:', error.message);
    console.log('Falling back to local file storage');
    s3Client = null;
  }
}

let uploadToS3;
let uploadBulkFiles;

if (isS3Configured && s3Client) {
  // Use S3 storage for images
  uploadToS3 = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: 'public-read',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, `student-photos/${fileName}`);
      }
    }),
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      fieldSize: 10 * 1024 * 1024 // 10MB limit for fields
    },
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png|gif/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Use S3 storage for bulk files (Excel/CSV)
  uploadBulkFiles = multer({
    storage: multerS3({
      s3: s3Client,
      bucket: process.env.AWS_BUCKET_NAME,
      acl: 'public-read',
      metadata: (req, file, cb) => {
        cb(null, { fieldName: file.fieldname });
      },
      key: (req, file, cb) => {
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, `bulk-uploads/${fileName}`);
      }
    }),
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit for bulk files
      fieldSize: 50 * 1024 * 1024 // 50MB limit for fields
    },
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /xlsx|xls|csv/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      const mimetype = allowedMimeTypes.includes(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed!'));
      }
    }
  });
}

// Use local storage when S3 is not configured or client creation failed
if (!isS3Configured || !s3Client) {
  // Use local storage when S3 is not configured
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      // Ensure directory exists
      const fs = require('fs');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
      cb(null, fileName);
    }
  });

  uploadToS3 = multer({
    storage: storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB limit
      fieldSize: 10 * 1024 * 1024 // 10MB limit for fields
    },
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png|gif/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedFileTypes.test(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  });

  // Local storage for bulk files
  uploadBulkFiles = multer({
    storage: storage,
    limits: {
      fileSize: 50 * 1024 * 1024, // 50MB limit for bulk files
      fieldSize: 50 * 1024 * 1024 // 50MB limit for fields
    },
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /xlsx|xls|csv/;
      const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const allowedMimeTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'text/csv'
      ];
      const mimetype = allowedMimeTypes.includes(file.mimetype);

      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed!'));
      }
    }
  });
}

// Add logging function for S3 configuration
function logS3Config() {
  if (isS3Configured && s3Client) {
    console.log('S3 Bucket:', process.env.AWS_BUCKET_NAME);
    console.log('AWS Region:', process.env.AWS_REGION);
    console.log('Using S3 storage for file uploads');
  } else {
    console.log('Using local file storage instead of S3');
    if (!isS3Configured) {
      console.log('Reason: AWS credentials not fully configured');
    } else if (!s3Client) {
      console.log('Reason: Failed to create S3 client');
    }
  }
}

// Middleware to transform local file paths to URLs in the response
const handleLocalFileUrls = (req, res, next) => {
  if ((!isS3Configured || !s3Client) && req.files) {
    // Add a location property to each file that mimics the S3 response
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    // Handle multiple file fields
    if (typeof req.files === 'object' && !Array.isArray(req.files)) {
      Object.keys(req.files).forEach(fieldname => {
        req.files[fieldname].forEach(file => {
          file.location = `${baseUrl}/uploads/${file.filename}`;
        });
      });
    }
    // Handle single file field array
    else if (Array.isArray(req.files)) {
      req.files.forEach(file => {
        file.location = `${baseUrl}/uploads/${file.filename}`;
      });
    }
    // Handle single file
    else if (req.file) {
      req.file.location = `${baseUrl}/uploads/${req.file.filename}`;
    }
  }
  next();
};

module.exports = {
  s3: s3Client,
  uploadToS3,
  uploadBulkFiles,
  logS3Config,
  handleLocalFileUrls,
  isS3Configured
};