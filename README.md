# TRIXTECH Event Booking System

A production-ready event booking platform with completely separated frontend and backend services.

## Project Structure

\`\`\`
project-root/
├── frontend/               # Next.js frontend application (Port 3000)
│   ├── app/               # Next.js app directory
│   ├── components/        # React components
│   ├── lib/              # Utilities and contexts
│   ├── package.json
│   └── README.md
│
├── backend/               # Express.js backend API (Port 5000)
│   ├── routes/           # API route handlers
│   ├── server.js         # Express server
│   ├── package.json
│   ├── .env              # Environment variables
│   └── README.md
│
└── README.md             # This file
\`\`\`

## Features

✅ User Authentication (Login/Register)
✅ Browse and Filter Services
✅ Create and Manage Bookings
✅ Track Booking Status
✅ Inventory Management Dashboard
✅ Admin Dashboard
✅ Payment Processing
✅ Responsive Design
✅ TypeScript Support
✅ Clean REST API Backend

## Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn installed

### Running the Backend

Open **Terminal 1**:

\`\`\`bash
cd backend
npm install
node server.js
\`\`\`

Backend will start on `http://localhost:5000`

### Running the Frontend

Open **Terminal 2**:

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Frontend will start on `http://localhost:3000`

## Tech Stack

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Lucide Icons

### Backend
- Express.js
- Node.js
- UUID for unique IDs
- CORS for cross-origin requests
- dotenv for configuration

## Demo Credentials

**Admin Account:**
- Email: `admin@trixtech.com`
- Password: `admin123`

**Demo Customer:**
- Email: `user@example.com`
- Password: `user123`

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category

### Inventory
- `GET /api/inventory` - Get all items
- `POST /api/inventory` - Create item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment

## Environment Variables

### Frontend (.env.local)
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

### Backend (.env)
\`\`\`
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
\`\`\`

## Available Commands

### Frontend
\`\`\`bash
cd frontend

npm run dev      # Start development server (Port 3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
\`\`\`

### Backend
\`\`\`bash
cd backend

node server.js   # Start production server
npm run dev      # Start with auto-reload (requires nodemon)
\`\`\`

## Health Check

\`\`\`bash
curl http://localhost:5000/health
\`\`\`

Response:
\`\`\`json
{ "status": "Backend is running" }
\`\`\`

## Troubleshooting

**Port already in use:**
- Backend: Change `PORT` in `backend/.env`
- Frontend: Modify the dev script in `frontend/package.json`

**API connection issues:**
- Ensure backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in frontend `.env.local`
- Verify CORS settings in `backend/server.js`

**Data persistence:**
- Backend uses in-memory storage (data resets on restart)
- Frontend uses localStorage for client-side data
- For production, integrate with a real database

## Development Workflow

1. **Start Backend** - Run `node server.js` in the backend folder
2. **Start Frontend** - Run `npm run dev` in the frontend folder
3. **Access App** - Open `http://localhost:3000` in your browser
4. **Test API** - Visit `http://localhost:5000/health` to verify backend

## Future Enhancements

- [ ] Real database integration (MongoDB/PostgreSQL)
- [ ] JWT-based authentication with token refresh
- [ ] Email notifications
- [ ] Real payment gateway integration (Stripe)
- [ ] Advanced analytics and reporting
- [ ] Customer reviews and ratings
- [ ] Calendar availability system
- [ ] Real-time notifications
- [ ] Mobile app (Flutter)
- [ ] Automated testing suite

## Technologies

- **Framework:** Next.js 14, Express.js
- **Language:** TypeScript, JavaScript
- **UI:** Radix UI, Tailwind CSS, Lucide Icons
- **State:** React Context, localStorage
- **API:** REST with Express

## License

All rights reserved © 2025 TRIXTECH

## Support

For issues or questions, please refer to the individual README files in the frontend and backend folders for more detailed information.
