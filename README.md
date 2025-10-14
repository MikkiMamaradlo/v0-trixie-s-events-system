# TRIXTECH - Booking and Reservation System

*Automatically synced with your [v0.app](https://v0.app) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mikkis-projects-3a0ed22d/v0-trixie-s-events-system)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/7W4uNJhUAVt)

## Overview

A comprehensive booking and reservation system for **Trixie's Events, Supplies, and Services** - featuring party planning, equipment rental, and catering services. Built with Next.js 15, React 19, TypeScript, and Tailwind CSS.

## Features

### Customer Portal
- 🎉 **Browse Services** - Party planning, equipment rental, and catering options
- 📅 **Book Services** - Easy booking flow with date selection
- 💳 **Payment Processing** - Mock payment interface with card details
- 📋 **Booking Management** - View and track all your bookings

### Admin Dashboard
- 📊 **Dashboard Overview** - Statistics and revenue tracking
- 🎫 **Bookings Management** - View and update booking statuses
- 📦 **Inventory Management** - Full CRUD operations for equipment and supplies
- 📆 **Calendar View** - Visual calendar of all bookings
- 💰 **Payment Management** - Track revenue and payment transactions

## Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/MikkiMamaradlo/v0-trixie-s-events-system.git
   cd v0-trixie-s-events-system
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Run the development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Default Credentials

### Admin Access
- **Password**: `admin123`
- Access at: `/admin`

### Customer Login
- Any email/password combination works for demo purposes

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Components**: shadcn/ui (Radix UI)
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Forms**: React Hook Form
- **State Management**: React Context API
- **Data Storage**: localStorage (demo mode)

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── admin/             # Admin dashboard
│   ├── booking/           # Booking pages
│   ├── bookings/          # User bookings
│   ├── login/             # Authentication
│   ├── services/          # Services catalog
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── ui/               # UI components (shadcn)
│   └── navigation.tsx    # Navigation bar
├── lib/                   # Utilities
│   ├── auth-context.tsx  # Auth context
│   └── utils.ts          # Helper functions
└── public/               # Static assets
\`\`\`

## Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
\`\`\`

## Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - Complete file structure and architecture

## Deployment

Your project is live at:
**[https://vercel.com/mikkis-projects-3a0ed22d/v0-trixie-s-events-system](https://vercel.com/mikkis-projects-3a0ed22d/v0-trixie-s-events-system)**

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/MikkiMamaradlo/v0-trixie-s-events-system)

## Future Enhancements

- [ ] Database integration (Supabase/Neon)
- [ ] Real authentication system
- [ ] Stripe payment integration
- [ ] Email notifications
- [ ] File upload support
- [ ] Advanced reporting and analytics
- [ ] Mobile app (React Native/Flutter)

## Contributing

This repository is automatically synced with [v0.app](https://v0.app). To make changes:

1. Continue building on [v0.app/chat/projects/7W4uNJhUAVt](https://v0.app/chat/projects/7W4uNJhUAVt)
2. Deploy your changes from v0
3. Changes will automatically sync to this repository

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions:
- Check the [SETUP_GUIDE.md](./SETUP_GUIDE.md) for troubleshooting
- Open an issue on GitHub
- Contact the development team

---

**Built with ❤️ using [v0.app](https://v0.app)**
