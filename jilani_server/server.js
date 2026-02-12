require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const basicRoutes = require("./routes/index");
const authRoutes = require("./routes/authRoutes");
const volunteerRoutes = require('./routes/volunteerRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const parentRoutes = require('./routes/parentRoutes');
const eventRoutes = require('./routes/eventRoutes');
const sportRoutes = require('./routes/sportRoutes');
const registrationRoutes = require('./routes/registrationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const faqRoutes = require('./routes/faqRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');
const roversWebsiteRoutes = require('./routes/roversWebsiteRoutes');
const { connectDB } = require("./config/database");
const checkMongoDB = require("./scripts/checkMongoDB");
const cors = require("cors");
const tcpPortUsed = require('tcp-port-used');
const http = require('http');
const { Server } = require('socket.io');
const StatisticsService = require('./services/statisticsService');
const { uploadToS3, logS3Config } = require('./utils/s3');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Log S3 configuration
logS3Config();

if (!process.env.DATABASE_URL) {
  console.error("Error: DATABASE_URL variable in .env missing.");
  process.exit(1);
}

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Increase timeout for file uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Create HTTP server with increased timeout
const server = http.createServer(app);
server.timeout = 300000; // 5 minutes timeout

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || "http://localhost:5173",
      "http://localhost:5173",
      "https://rovers.life"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  },
  pingTimeout: 300000, // 5 minutes
  pingInterval: 60000, // 1 minute
  connectTimeout: 300000, // 5 minutes
  maxHttpBufferSize: 50 * 1024 * 1024 // 50MB
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Store the Socket.IO instance for use in other files
app.set('io', io);

// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory:', uploadsDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadsDir));

// Session configuration
app.use(session({
  secret: process.env.JWT_SECRET || 'your_jwt_secret_here',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DATABASE_URL,
    ttl: 24 * 60 * 60, // Session TTL of 1 day
    touchAfter: 24 * 3600 // Only update session every 24 hours
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));

// Add Content Security Policy headers for Razorpay
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.razorpay.com;"
  );
  next();
});

// Enable CORS with proper configuration
app.use(cors({
  origin: [
    process.env.CLIENT_URL || "http://localhost:5173",
    "http://localhost:5173",
    "https://rovers.life"
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400 // 24 hours
}));

// Authentication routes
app.use('/api/auth', authRoutes);

// Volunteer routes
app.use('/api/volunteer', volunteerRoutes);

// Student routes
app.use('/api/students', studentRoutes);

// Attendance routes
app.use('/api/attendance', attendanceRoutes);

// Statistics routes
app.use('/api/statistics', statisticsRoutes);

// Parent routes
app.use('/api/parent', parentRoutes);

// Event routes
app.use('/api/events', eventRoutes);

// Sport routes
app.use('/api/sports', sportRoutes);

// Registration routes
app.use('/api/registration', registrationRoutes);

// Payment routes
app.use('/api/payment', paymentRoutes);

// FAQ routes
app.use('/api/faqs', faqRoutes);

// Diagnostic routes for system health and troubleshooting
app.use('/api/diagnostics', diagnosticRoutes);

// Rovers website form submission routes
app.use('/api/rovers-website', roversWebsiteRoutes);

// Make io instance globally available
global.io = io;

// Initialize socket utilities
const socketUtils = require('./utils/socket');
socketUtils.initialize(io);

// Function to log server details
const logServerDetails = () => {
  console.log('=== SERVER DETAILS ===');
  console.log(`Node.js Version: ${process.version}`);
  console.log(`Operating System: ${os.type()} ${os.release()}`);
  console.log(`Memory: ${Math.round(os.freemem() / 1024 / 1024)}MB free of ${Math.round(os.totalmem() / 1024 / 1024)}MB`);
  console.log(`Process ID: ${process.pid}`);
  console.log(`Working Directory: ${process.cwd()}`);

  // Check if necessary files exist
  const publicDir = path.join(__dirname, 'public');
  if (fs.existsSync(publicDir)) {
    console.log(`Public directory exists at: ${publicDir}`);
  } else {
    console.warn(`Public directory not found at: ${publicDir}`);
  }

  // Log environment variables (redact sensitive info)
  console.log('Environment Variables:');
  for (const key in process.env) {
    if (key.includes('SECRET') || key.includes('KEY') || key.includes('PASSWORD')) {
      console.log(`${key}: [REDACTED]`);
    } else {
      console.log(`${key}: ${process.env[key]}`);
    }
  }

  console.log('=== END SERVER DETAILS ===');
};
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: "https://d7c4d9bea8257c2437319b3d84cc49f8@o4506876750725120.ingest.us.sentry.io/4509195482759168",
});


// Start server after ensuring MongoDB is running
const startServer = async () => {
  try {
    await connectDB();

    // Log server details after database connection is established
    logServerDetails();

    try {
      // Check if FAQs collection is empty and seed if needed
      const FAQ = require('./models/FAQ');
      const faqCount = await FAQ.countDocuments();

      if (faqCount === 0) {
        console.log('No FAQs found in database, seeding initial data...');

        // Common FAQs not specific to any sport
        const commonFAQs = [
          {
            question: "What should my child wear to the event?",
            answer: "Comfortable sportswear appropriate for the specific sport. Details will be provided in the pre-event information email.",
            order: 1
          },
          {
            question: "How early should we arrive before the event starts?",
            answer: "We recommend arriving at least 30 minutes before your scheduled time to complete check-in procedures.",
            order: 2
          },
          {
            question: "Is water provided or should we bring our own?",
            answer: "While water stations will be available, we recommend bringing a personal water bottle to stay hydrated throughout the event.",
            order: 3
          },
          {
            question: "What is the refund policy if we cannot attend?",
            answer: "Refunds are available up to 7 days before the event. After that, we can offer credit toward future events.",
            order: 4
          },
          {
            question: "Are parents allowed to stay and watch?",
            answer: "Yes, we encourage parent support! Designated viewing areas will be clearly marked at each venue.",
            order: 5
          }
        ];

        // First get a default sport to use for non-sport-specific FAQs
        const Sport = require('./models/Sport');
        const defaultSport = await Sport.findOne();

        if (!defaultSport) {
          console.log('No sports found in database, cannot seed FAQs');
          return;
        }

        // Add the required sport field to common FAQs
        const commonFAQsWithSport = commonFAQs.map(faq => ({
          ...faq,
          sport: defaultSport._id // Use default sport for common FAQs
        }));

        // Insert common FAQs
        await FAQ.insertMany(commonFAQsWithSport);
        console.log(`Added ${commonFAQsWithSport.length} common FAQs`);

        // Seed FAQs for all sports
        const sports = await Sport.find();
        let sportSpecificFAQs = [];

        // For each sport, create specific FAQs
        for (const sport of sports) {
          // Add sport-specific FAQs with correct sport field
          sportSpecificFAQs.push({
            sport: sport._id,  // Use sport instead of sportId
            question: `What equipment is needed for ${sport.name}?`,
            answer: `For ${sport.name}, participants should bring appropriate footwear and sportswear. Specialized equipment will be provided at the venue.`,
            order: 1
          });

          sportSpecificFAQs.push({
            sport: sport._id,  // Use sport instead of sportId
            question: `How long does the ${sport.name} event typically last?`,
            answer: `${sport.name} events usually last between 2-3 hours, including warm-up, competition, and awards ceremony.`,
            order: 2
          });

          sportSpecificFAQs.push({
            sport: sport._id,  // Use sport instead of sportId
            question: `What age groups compete together in ${sport.name}?`,
            answer: `In ${sport.name}, we organize competitions by age categories to ensure fair play. Please refer to the event details for specific groupings.`,
            order: 3
          });
        }

        // Insert sport-specific FAQs if any
        if (sportSpecificFAQs.length > 0) {
          await FAQ.insertMany(sportSpecificFAQs);
          console.log(`Added ${sportSpecificFAQs.length} sport-specific FAQs`);
        }

        const totalFAQs = await FAQ.countDocuments();
        console.log(`Total FAQs in database after seeding: ${totalFAQs}`);
      } else {
        console.log(`Found ${faqCount} existing FAQs in database, skipping seed`);
      }
    } catch (error) {
      console.error('Error while checking/seeding FAQs:', error);
      console.log('Continuing server startup despite FAQ seeding error');
    }

    // If both succeeded, start the server
    server.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log('MongoDB connected successfully');
      console.log('WebSocket server initialized');
    });
  } catch (error) {
    console.error(`Failed to start server: ${error.message}`);
    console.error(error.stack);
    if (error.message.includes('MongoDB is not installed')) {
      console.log('\nPlease install MongoDB and try again.');
    }
    process.exit(1);
  }
};

// Start the server
startServer();

// Basic Routes
app.use(basicRoutes);

// If no routes handled the request, it's a 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Replace the error handling middleware with this enhanced version
app.use((err, req, res, next) => {
  console.error('=== SERVER ERROR ===');
  console.error(`Timestamp: ${new Date().toISOString()}`);
  console.error(`Error Message: ${err.message}`);
  console.error(`Error Name: ${err.name}`);
  console.error(`Request URL: ${req.originalUrl}`);
  console.error(`Request Method: ${req.method}`);
  console.error(`Request IP: ${req.ip}`);
  console.error(`User Agent: ${req.get('User-Agent')}`);

  // Log request body but redact sensitive information
  const safeBody = { ...req.body };
  for (const key in safeBody) {
    if (key.toLowerCase().includes('password') ||
      key.toLowerCase().includes('token') ||
      key.toLowerCase().includes('secret')) {
      safeBody[key] = '[REDACTED]';
    }
  }
  console.error(`Request Body: ${JSON.stringify(safeBody, null, 2)}`);

  // Log the stack trace
  console.error('Stack Trace:');
  console.error(err.stack);
  console.error('=== END SERVER ERROR ===');

  // Determine response based on environment
  const isProduction = process.env.NODE_ENV === 'production';

  const errorResponse = {
    error: isProduction ? 'Internal server error' : err.name,
    message: isProduction ? 'An error occurred' : err.message,
    status: err.status || 500,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  };

  // Add stack trace in development environment
  if (!isProduction) {
    errorResponse.stack = err.stack;
  }

  res.status(errorResponse.status).json(errorResponse);
});

// Export the io instance so other modules can access it
module.exports = { app, io };