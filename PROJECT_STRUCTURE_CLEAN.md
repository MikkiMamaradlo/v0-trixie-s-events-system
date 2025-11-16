# TRIXTECH Booking System - Clean File Structure

## 📁 Project Organization

\`\`\`
trixtech-booking-system/
│
├── 📂 FRONTEND/                    # Next.js Customer & Admin Interface
│   ├── app/
│   │   ├── (pages)/
│   │   │   ├── page.tsx           # 🏠 Homepage
│   │   │   ├── layout.tsx         # 🔧 Root Layout
│   │   │   └── globals.css        # 🎨 Global Styles & Design Tokens
│   │   │
│   │   ├── (customer)/            # Customer Pages
│   │   │   ├── services/
│   │   │   │   ├── page.tsx       # 📋 Browse Services
│   │   │   │   └── loading.tsx
│   │   │   ├── bookings/
│   │   │   │   ├── page.tsx       # 📅 My Bookings
│   │   │   │   └── loading.tsx
│   │   │   ├── booking/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # 💳 Booking Form & Payment
│   │   │   └── login/
│   │   │       └── page.tsx       # 🔐 Customer Login
│   │   │
│   │   ├── (admin)/               # Admin Pages
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx       # 📊 Admin Dashboard
│   │   │   │   └── payments/
│   │   │   │       └── page.tsx   # 💰 Payment Management
│   │   │   └── signup/
│   │   │       └── page.tsx       # 📝 Customer Signup
│   │   │
│   │   └── api/                   # API Routes
│   │       ├── auth/
│   │       │   ├── login/route.ts
│   │       │   ├── signup/route.ts
│   │       │   └── admin-login/route.ts
│   │       ├── bookings/route.ts
│   │       ├── services/route.ts
│   │       ├── inventory/route.ts
│   │       └── payments/route.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navigation.tsx     # 🧭 Navigation Bar
│   │   │   ├── footer.tsx         # 🔲 Footer
│   │   │   └── header.tsx         # 🎯 Header
│   │   │
│   │   ├── admin/                 # Admin Components
│   │   │   ├── admin-login.tsx
│   │   │   ├── bookings-management.tsx
│   │   │   ├── inventory-management.tsx
│   │   │   ├── calendar-view.tsx
│   │   │   ├── payment-management.tsx
│   │   │   └── analytics-dashboard.tsx
│   │   │
│   │   ├── customer/              # Customer Components
│   │   │   ├── service-card.tsx
│   │   │   ├── booking-form.tsx
│   │   │   ├── payment-form.tsx
│   │   │   └── booking-list.tsx
│   │   │
│   │   ├── common/                # Shared Components
│   │   │   ├── loader.tsx
│   │   │   ├── error-boundary.tsx
│   │   │   └── alerts.tsx
│   │   │
│   │   └── ui/                    # shadcn/ui Components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── dialog.tsx
│   │       ├── table.tsx
│   │       └── ... (50+ UI components)
│   │
│   ├── lib/
│   │   ├── auth-context.tsx       # 🔑 Authentication Context
│   │   ├── utils.ts               # 🛠️ Helper Functions
│   │   └── constants.ts           # ⚙️ App Constants
│   │
│   ├── hooks/
│   │   ├── use-auth.ts            # 🔐 Auth Hook
│   │   ├── use-mobile.ts          # 📱 Mobile Detection
│   │   └── use-toast.ts           # 🔔 Toast Hook
│   │
│   ├── types/
│   │   ├── booking.ts             # 📋 Booking Types
│   │   ├── service.ts             # 🛎️ Service Types
│   │   ├── user.ts                # 👤 User Types
│   │   └── index.ts               # 📦 Type Exports
│   │
│   ├── public/
│   │   ├── images/
│   │   │   ├── services/
│   │   │   ├── events/
│   │   │   └── ui/
│   │   ├── icons/
│   │   └── logo.svg
│   │
│   ├── config/
│   │   ├── site.config.ts         # 🌐 Site Configuration
│   │   └── api.config.ts          # 🔌 API Configuration
│   │
│   ├── styles/
│   │   ├── globals.css
│   │   ├── variables.css
│   │   └── components.css
│   │
│   ├── next.config.mjs
│   ├── tsconfig.json
│   ├── package.json
│   ├── .env.local                 # Environment Variables (local)
│   └── README.md                  # Frontend Documentation
│
├── 📂 BACKEND/                    # Express.js API Server
│   ├── src/
│   │   ├── routes/                # 🛣️ API Routes
│   │   │   ├── auth.js            # Authentication Routes
│   │   │   ├── bookings.js        # Booking Routes
│   │   │   ├── services.js        # Service Routes
│   │   │   ├── inventory.js       # Inventory Routes
│   │   │   ├── payments.js        # Payment Routes
│   │   │   └── admin.js           # Admin Routes
│   │   │
│   │   ├── models/                # 📊 Data Models
│   │   │   ├── User.js
│   │   │   ├── Booking.js
│   │   │   ├── Service.js
│   │   │   ├── Inventory.js
│   │   │   ├── Payment.js
│   │   │   └── index.js           # Model Exports
│   │   │
│   │   ├── middleware/            # 🔐 Middleware
│   │   │   ├── auth.js            # Authentication Middleware
│   │   │   ├── errorHandler.js    # Error Handler
│   │   │   ├── logger.js          # Request Logger
│   │   │   └── validation.js      # Data Validation
│   │   │
│   │   ├── controllers/           # 💼 Business Logic
│   │   │   ├── authController.js
│   │   │   ├── bookingController.js
│   │   │   ├── serviceController.js
│   │   │   ├── inventoryController.js
│   │   │   └── paymentController.js
│   │   │
│   │   ├── database/              # 💾 Database Setup
│   │   │   ├── connection.js      # DB Connection
│   │   │   ├── migrations.js      # DB Migrations
│   │   │   └── seed.js            # Seed Data
│   │   │
│   │   ├── utils/                 # 🛠️ Utilities
│   │   │   ├── validators.js      # Input Validators
│   │   │   ├── helpers.js         # Helper Functions
│   │   │   ├── constants.js       # Constants
│   │   │   └── logger.js          # Logging Utility
│   │   │
│   │   ├── config/                # ⚙️ Configuration
│   │   │   ├── db.config.js       # Database Config
│   │   │   ├── app.config.js      # App Config
│   │   │   └── env.js             # Environment Variables
│   │   │
│   │   └── app.js                 # 🚀 Express App Setup
│   │
│   ├── server.js                  # 🎯 Server Entry Point (node server.js)
│   ├── package.json               # Dependencies
│   ├── .env                       # Environment Variables
│   ├── .env.example               # Environment Example
│   ├── README.md                  # Backend Documentation
│   └── API.md                     # API Documentation
│
├── 📂 DOCS/                       # Documentation
│   ├── SETUP.md                   # 📚 Setup Instructions
│   ├── DEPLOYMENT.md              # 🚀 Deployment Guide
│   ├── ARCHITECTURE.md            # 🏗️ System Architecture
│   ├── API.md                     # 📡 API Documentation
│   ├── CONTRIBUTING.md            # 🤝 Contributing Guide
│   └── TROUBLESHOOTING.md         # 🔧 Troubleshooting
│
├── 📂 TESTS/                      # Test Files
│   ├── unit/
│   │   ├── utils.test.js
│   │   └── validators.test.js
│   ├── integration/
│   │   └── api.test.js
│   └── e2e/
│       └── booking-flow.test.js
│
├── .gitignore
├── .env.example
├── docker-compose.yml            # 🐳 Docker Setup (optional)
├── .dockerignore
├── README.md                      # 📖 Main Project README
└── QUICK_START.md                 # ⚡ Quick Start Guide

\`\`\`

---

## 🎯 What Each Folder Does

### FRONTEND/
- **app/** - Next.js pages and API routes
- **components/** - React components organized by purpose
- **lib/** - Context, utilities, and helpers
- **hooks/** - Custom React hooks
- **types/** - TypeScript type definitions
- **public/** - Static assets
- **config/** - Application configuration
- **styles/** - CSS stylesheets

### BACKEND/
- **src/routes/** - API endpoint definitions
- **src/models/** - Data schemas and structures
- **src/middleware/** - Request/response processing
- **src/controllers/** - Business logic
- **src/database/** - Database connection and setup
- **src/utils/** - Helper functions
- **src/config/** - Configuration files

### DOCS/
- All documentation files for setup, deployment, and troubleshooting

### TESTS/
- Unit tests, integration tests, and E2E tests

---

## 🚀 Quick Commands

\`\`\`bash
# Frontend (Navigate to frontend folder)
cd frontend
npm install
npm run dev              # Runs on http://localhost:3000

# Backend (Navigate to backend folder)
cd backend
npm install
node server.js          # Runs on http://localhost:5000
\`\`\`

---

## 📝 Key Principles

1. **Clear Separation** - Frontend and Backend are completely independent
2. **Easy Navigation** - Find files quickly with logical grouping
3. **Scalability** - Structure supports growth and new features
4. **Maintainability** - Comments and organization make code easy to understand
5. **Consistency** - Same patterns throughout the codebase
