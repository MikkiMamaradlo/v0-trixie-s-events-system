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
   ```bash
   npm install
   ```

### Running the Application

**Note:** This application consists of two separate interfaces (Customer and Admin) that run on different ports. To run both simultaneously, you'll need to open two terminal windows.

#### Development Mode

**Customer Portal (Port 3000):**

```bash
npm run dev:customer
```

Access at: http://localhost:3000

**Admin Portal (Port 3001):**

```bash
npm run dev:admin
```

Access at: http://localhost:3001

#### Production Mode

**Customer Portal:**

```bash
npm run build
npm run start:customer
```

**Admin Portal:**

```bash
npm run build
npm run start:admin
```

### Default Credentials

**Admin Login:**

- URL: http://localhost:3001/admin
- Password: admin123

**Customer Login:**

- URL: http://localhost:3000/login
- Create new account via signup or use demo credentials

## Project Structure

```
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
```

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
