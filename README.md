# Rovers Portal

A comprehensive full-stack sports event management platform built for **Rovers Malaysia** — enabling parents, schools, volunteers, and administrators to manage sports events, student registrations, payments, and live event tracking.

**Live Site:** [https://rovers.life](https://rovers.life)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Payment Integration](#payment-integration)
- [Database Schema](#database-schema)
- [Scripts & Utilities](#scripts--utilities)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

### Parent / School Portal
- OTP-based authentication and password setup
- Student profile management (add, edit, bulk upload via CSV/Excel)
- Browse events and available sports
- Register students for individual and group sports
- Multiple payment methods (Stripe, Razorpay, Bank Transfer)
- Track registration history and payment status
- View group registration details with shared payment proof
- Support/FAQ access

### Volunteer Portal
- Volunteer registration and login
- QR code scanning for student attendance
- Checkpoint-based event tracking
- Real-time event updates via WebSocket

### Manager / Admin Dashboard
- Live event dashboard with real-time Socket.IO updates
- Volunteer and student management
- Registration approval workflow (pending / approved / rejected)
- Event and sport CRUD management
- Statistics, reporting, and data export (CSV/Excel)
- Payment verification and tracking

### System Capabilities
- JWT-based authentication with refresh tokens
- OTP verification via email (Nodemailer + ZeptoMail)
- File uploads to AWS S3 (student photos, payment proofs)
- QR code generation for students
- PDF generation for certificates and reports
- Real-time communication via Socket.IO
- Error monitoring with Sentry
- Analytics with Microsoft Clarity
- AI-powered features (Anthropic Claude + OpenAI integration)

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool & Dev Server |
| TailwindCSS | Utility-first Styling |
| Radix UI | Accessible Component Library |
| React Router v7 | Client-side Routing |
| React Hook Form + Zod | Form Handling & Validation |
| Recharts | Data Visualization |
| Stripe.js + Razorpay | Payment UI Integration |
| Socket.IO Client | Real-time Communication |
| Firebase | Additional Auth & Services |
| Sentry | Error Tracking |
| Lucide React | Icon Library |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime |
| Express 4 | Web Framework |
| MongoDB Atlas | Cloud Database |
| Mongoose | ODM |
| JWT + bcrypt | Authentication & Security |
| Stripe + Razorpay | Payment Processing |
| AWS S3 | File/Image Storage |
| Multer | File Upload Middleware |
| Nodemailer + ZeptoMail | Email Services |
| Socket.IO | WebSocket Server |
| pdf-lib + Chart.js | PDF & Chart Generation |
| qrcode | QR Code Generation |
| Winston + Pino | Logging |
| Sentry | Error Monitoring |

---

## Project Structure

```
rovers-portal/
├── website/                 # Frontend (React + TypeScript + Vite)
│   ├── src/
│   │   ├── api/                   # API client modules (axios-based)
│   │   ├── components/            # Reusable React components
│   │   │   └── ui/                # Radix UI component wrappers
│   │   ├── contexts/              # React Context (AuthContext)
│   │   ├── hooks/                 # Custom React hooks
│   │   ├── pages/                 # Page-level components (22 pages)
│   │   ├── types/                 # TypeScript type definitions
│   │   ├── utils/                 # Utility functions
│   │   ├── lib/                   # Library utilities
│   │   ├── App.tsx                # Main app with route definitions
│   │   └── main.tsx               # Entry point (Sentry init)
│   ├── public/                    # Static assets
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── server/                 # Backend (Node.js + Express)
│   ├── routes/                    # Express route handlers (17 files)
│   ├── models/                    # Mongoose models (13 collections)
│   ├── services/                  # Business logic layer (18 services)
│   ├── middleware/                # Auth, upload, file handling
│   ├── utils/                     # Helpers (S3, email, JWT, OTP)
│   ├── scripts/                   # DB seeding & utility scripts
│   ├── config/                    # Database configuration
│   ├── server.js                  # Express server entry point
│   ├── Dockerfile                 # Docker containerization
│   └── package.json
│
├── public/                        # Root-level static assets
└── README.md
```

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local or MongoDB Atlas cloud)
- **npm** or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/sritharun242004/Rovers-portal.git
   cd Rovers-portal
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../website
   npm install
   ```

4. **Set up environment variables**

   Create a `.env` file in `server/` (see [Environment Variables](#environment-variables) section below).

5. **Seed the database (optional)**
   ```bash
   cd server
   node scripts/seedDatabase.js
   node scripts/seedCategoryData.js
   node scripts/updateSportPricing.js
   ```

6. **Start the backend server**
   ```bash
   cd server
   npm start
   ```
   Server runs on `http://localhost:3000`

7. **Start the frontend dev server**
   ```bash
   cd website
   npm run dev
   ```
   Client runs on `http://localhost:5173`

---

## Environment Variables

### Backend (`server/.env`)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/attendance_db

# Authentication
JWT_SECRET=your_jwt_secret_key
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# Client URL (for CORS)
CLIENT_URL=http://localhost:5173

# Stripe Payment
STRIPE_SECRET_KEY=sk_test_xxx
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Razorpay Payment
RAZORPAY_KEY_ID=rzp_test_xxx
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AWS S3 Storage
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=your_bucket_name

# Email - Gmail SMTP
ROVERS_GMAIL_USER=your_email@gmail.com
ROVERS_GMAIL_APP_PASSWORD=your_app_password

# Email - ZeptoMail (Zoho)
ZEPTO_URL=api.zeptomail.in/
ZEPTO_TOKEN=your_zepto_token

# Firebase
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
VITE_MEASUREMENT_ID=G-XXXXXXXXXX

# Analytics
VITE_CLARITY_ID=your_clarity_id

# Sentry
SENTRY_DSN=your_sentry_dsn
```

---

## API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/request-otp` | Send OTP to email |
| POST | `/verify-otp` | Verify OTP and login |
| POST | `/register` | Register new user |
| POST | `/refresh-token` | Refresh access token |
| POST | `/setup-password` | Set password after registration |
| POST | `/forgot-password` | Initiate password recovery |
| POST | `/verify-forgot-otp` | Verify forgot password OTP |

### Students (`/api/students`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all students (with filters) |
| GET | `/filter-options` | Get available filter options |
| GET | `/:studentId` | Get student details |
| POST | `/add` | Add new student |
| PUT | `/:studentId` | Update student |
| DELETE | `/:studentId` | Delete student |
| POST | `/bulk-upload` | Bulk upload via CSV/Excel |
| GET | `/search/:query` | Search students |

### Registrations (`/api/registrations`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register student for a sport |
| GET | `/eligible-students` | Get eligible students |
| GET | `/eligible-categories` | Get eligible age categories |
| GET | `/parent-registrations` | Get user's registrations |
| GET | `/registration/:id` | Get registration details |
| POST | `/bulk-register` | Bulk register students |
| POST | `/notify-parents` | Send payment notification |

### Payments (`/api/payment`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/countries` | Get supported countries/pricing |
| POST | `/calculate` | Calculate fees (sport or country based) |
| GET | `/sport/:sportId/pricing` | Get sport-specific pricing |
| POST | `/create-payment-intent` | Create Stripe payment intent |
| POST | `/create-razorpay-order` | Create Razorpay order |
| POST | `/confirm-payment` | Confirm payment and register |
| POST | `/webhook` | Stripe webhook handler |

### Events (`/api/events`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all events |
| GET | `/:id` | Get event details |
| POST | `/` | Create event (admin) |
| PUT | `/:id` | Update event (admin) |
| DELETE | `/:id` | Delete event (admin) |
| GET | `/:id/sports` | Get sports for an event |

### Sports (`/api/sports`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | List all sports |
| GET | `/:id` | Get sport details |
| POST | `/` | Create sport (admin) |
| PUT | `/:id` | Update sport (admin) |
| DELETE | `/:id` | Delete sport (admin) |

### Parent (`/api/parent`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students` | Get parent's students |
| GET | `/students/:studentId` | Get specific student |
| GET | `/registrations` | Get all registrations |
| POST | `/add-student` | Add child student |
| PUT | `/student/:id` | Update student |

### Volunteers (`/api/volunteer`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | Register volunteer |
| GET | `/:id` | Get volunteer details |
| PUT | `/:id` | Update volunteer |
| DELETE | `/:id` | Delete volunteer |

### Other Routes
| Route | Description |
|-------|-------------|
| `/api/attendance` | Student attendance tracking |
| `/api/statistics` | Event and system statistics |
| `/api/faqs` | FAQ management |
| `/api/diagnostics` | System diagnostics |

---

## User Roles

| Role | Access Level |
|------|-------------|
| **Parent** | Manage own students, register for events, make payments, view registrations |
| **School** | Same as parent + bulk upload students, school code verification |
| **Manager** | Full admin access — manage events, sports, students, volunteers, live dashboard |
| **Volunteer** | Event check-in, QR scanning, attendance tracking |
| **Temporary** | Limited access for temporary users |

---

## Payment Integration

### Sport-Based Pricing

| Sport | Fee (MYR) |
|-------|-----------|
| Skating | 100 |
| Badminton | 100 |
| Taekwondo | 100 |
| Silambam | 100 |
| Karate | 150 |
| Athletics | 30 |
| Football | 300 |
| Cricket | 300 |

### Supported Payment Methods

1. **Stripe** — Online card payments
2. **Razorpay** — Alternative online payment gateway
3. **Bank Transfer** — Manual payment with proof upload

### Group Registrations
- Group sports require a minimum of 7 students
- Support for up to 2 substitutes per team
- Shared payment proof tracking across group members

---

## Database Schema

### Core Collections

| Collection | Purpose |
|-----------|---------|
| `users` | User accounts with roles and authentication |
| `students` | Student/athlete profiles with personal details |
| `sports` | Sport definitions with pricing and categories |
| `events` | Event information with dates and locations |
| `registrations` | Student-sport enrollments with payment tracking |
| `parentstudents` | Parent-student relationship mapping |
| `eventsports` | Event-sport associations |
| `agecategories` | Age group definitions |
| `distances` | Race distance categories |
| `volunteers` | Event volunteer records |
| `studentattendance` | Attendance tracking with checkpoints |
| `faqs` | Frequently asked questions |
| `queries` | User support inquiries |

---

## Scripts & Utilities

### Database Seeding
```bash
cd server

# Seed initial data
node scripts/seedDatabase.js

# Seed age categories and distances
node scripts/seedCategoryData.js

# Seed event-sport associations
node scripts/seedEventSportData.js

# Update sport pricing
node scripts/updateSportPricing.js

# Seed dummy users for testing
node scripts/seedDummyUsers.js

# Add sample events
node scripts/addSampleEvents.js
```

### Utility Scripts
```bash
# Generate QR codes for students
node scripts/generateStudentQRCodes.js

# Check paid registrations
node scripts/checkPaidRegistrations.js

# Verify MongoDB connection
node scripts/checkMongoDB.js
```

---

## Deployment

### Docker

```bash
cd server
docker build -t rovers-portal-server .
docker run -p 3000:3000 --env-file .env rovers-portal-server
```

### Production Build (Frontend)

```bash
cd website
npm run build
```

The built files will be in `website/dist/` — serve with any static file server or CDN.

### Infrastructure

- **Database:** MongoDB Atlas (cloud-hosted)
- **File Storage:** AWS S3 (`ap-south-1` region)
- **Email:** Gmail SMTP + Zoho ZeptoMail
- **Error Monitoring:** Sentry
- **Analytics:** Microsoft Clarity
- **Domain:** [rovers.life](https://rovers.life)

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## License

This project is proprietary software developed for **Rovers Malaysia**.

---

## Contact

For questions or support, reach out at **roversmalaysia@gmail.com**
