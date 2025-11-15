# TRIXTECH Event Booking System

A comprehensive event planning and booking system built with Next.js, featuring separate customer and admin interfaces.

## Features

### Customer Portal (Port 3000)

- Event browsing and booking
- User registration and authentication
- Dashboard for managing bookings
- Service selection (Party Planning, Equipment Rental, Catering)

### Admin Portal (Port 3001)

- Comprehensive admin dashboard
- User management
- Booking management
- Inventory management
- Reports and analytics
- Calendar view

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

### Running the Application

**Note:** This application consists of two separate interfaces (Customer and Admin) that run on different ports. To run both simultaneously, you'll need to open two terminal windows.

#### Development Mode

**Customer Portal (Port 3000):**

\`\`\`bash
npm run dev:customer
\`\`\`

Access at: http://localhost:3000

**Admin Portal (Port 3001):**

\`\`\`bash
npm run dev:admin
\`\`\`

Access at: http://localhost:3001

#### Production Mode

**Customer Portal:**

\`\`\`bash
npm run build
npm run start:customer
\`\`\`

**Admin Portal:**

\`\`\`bash
npm run build
npm run start:admin
\`\`\`

### Default Credentials

**Admin Login:**

- URL: http://localhost:3001/admin
- Password: admin123

**Customer Login:**

- URL: http://localhost:3000/login
- Create new account via signup or use demo credentials

### User-Friendly Setup Guide

**For New Users:**

1. **Start the Customer Portal first** (Port 3000) - This is where customers browse and book services
2. **Start the Admin Portal second** (Port 3001) - This is where you manage bookings and business operations

**Quick Start Commands:**

\`\`\`bash
# Terminal 1 - Customer Portal
npm run dev:customer

# Terminal 2 - Admin Portal
npm run dev:admin
\`\`\`

**What Each Portal Does:**

- **Customer Portal (localhost:3000):** Browse services, create accounts, make bookings, view booking history
- **Admin Portal (localhost:3001):** Manage bookings, view analytics, handle inventory, process payments

**Navigation Tips:**

- Use the "Back to Site" button in the admin panel to quickly switch to the customer view
- Customer navigation shows different options when logged in vs. logged out
- Admin panel has a tabbed interface for different management sections

### Troubleshooting

**Common Issues:**

1. **"Port already in use" error:**

   - Close other Node.js processes: `taskkill /f /im node.exe` (Windows)
   - Or use different ports by modifying the scripts in `package.json`

2. **WebSocket connection issues:**

   - Ensure both customer and admin servers are running
   - Check that the WebSocket server initialized message appears in the console

3. **Hydration mismatch errors:**

   - This is normal during development and won't affect functionality
   - The app will automatically recover on the client side

4. **Data not persisting:**
   - The app uses localStorage for demo purposes
   - Data will reset when clearing browser storage

**Getting Help:**

- Check the browser console for error messages
- Ensure Node.js version 18+ is installed
- Verify all dependencies are installed with `npm install`

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin pages
│   ├── booking/           # Booking pages
│   ├── dashboard/         # Customer dashboard
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── services/          # Services page
├── components/            # Reusable components
│   ├── admin/            # Admin-specific components
│   └── ui/               # UI components
├── lib/                  # Utilities and context
└── public/               # Static assets
\`\`\`

## Technologies Used

- **Framework:** Next.js 15
- **UI:** Radix UI + Tailwind CSS
- **State Management:** React Context
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React

## Development Notes

- Customer and admin interfaces run on separate ports to avoid interference
- Data is stored in localStorage for demo purposes
- Authentication is mock-based for demonstration
- Admin password: `admin123`

## License

This project is for demonstration purposes.
