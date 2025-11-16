# TRIXTECH Project Structure

## Directory Layout

\`\`\`
trixie-s-events-system/
├── backend/                    # Express.js API Server
│   ├── src/
│   │   ├── server.js          # Main server entry point
│   │   ├── routes/            # API route handlers
│   │   │   ├── bookings.js
│   │   │   ├── services.js
│   │   │   ├── inventory.js
│   │   │   ├── auth.js
│   │   │   └── payments.js
│   │   └── middleware/        # Custom middleware (if needed)
│   ├── package.json           # Backend dependencies
│   ├── .env                   # Environment variables
│   └── .gitignore
│
├── frontend/                  # Next.js React App
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx     # Root layout wrapper
│   │   │   ├── page.tsx       # Home page
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── services/
│   │   │   │   └── page.tsx
│   │   │   ├── booking/
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx
│   │   │   ├── bookings/
│   │   │   │   └── page.tsx
│   │   │   └── admin/         # Admin pages (future)
│   │   │
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   └── navigation.tsx
│   │   │   └── ui/            # Reusable UI components
│   │   │
│   │   ├── lib/
│   │   │   └── auth-context.tsx  # Auth state management
│   │   │
│   │   └── styles/
│   │       └── globals.css
│   │
│   ├── package.json           # Frontend dependencies
│   ├── tsconfig.json
│   ├── next.config.mjs
│   ├── .env.local
│   └── .gitignore
│
└── README.md                  # Main project documentation
\`\`\`

## Backend Structure

- `server.js` - Express server setup with middleware and route registration
- `routes/` - API endpoints organized by feature (bookings, services, etc.)
- `.env` - Environment configuration (PORT, CLIENT_URL)
- `package.json` - Dependencies (express, cors, dotenv, uuid)

Run: `cd backend && npm install && npm start`
Dev: `cd backend && npm install && npm run dev`

## Frontend Structure

- `app/` - Next.js App Router pages organized by route
- `components/` - Reusable React components
- `lib/` - Utilities and context (auth-context.tsx)
- `.env.local` - Frontend configuration (API_URL)
- `package.json` - Dependencies (next, react, tailwindcss, etc.)

Run: `cd frontend && npm install && npm run dev`

## How to Run

1. **Backend (Terminal 1)**:
   \`\`\`bash
   cd backend
   npm install
   npm start  # or npm run dev for development
   \`\`\`
   Server runs on: http://localhost:5000

2. **Frontend (Terminal 2)**:
   \`\`\`bash
   cd frontend
   npm install
   npm run dev
   \`\`\`
   App runs on: http://localhost:3000

## API Endpoints

### Auth
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Services
- `GET /api/services` - List all services
- `GET /api/services/:id` - Get service details
- `GET /api/services/category/:category` - Get services by category

### Bookings
- `GET /api/bookings` - List all bookings
- `GET /api/bookings/:id` - Get booking details
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking status
- `DELETE /api/bookings/:id` - Delete booking

### Inventory
- `GET /api/inventory` - List all items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/:id` - Update inventory item
- `DELETE /api/inventory/:id` - Delete inventory item

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Create payment

## Demo Credentials

- Email: `admin@trixtech.com`
- Password: `admin123`
