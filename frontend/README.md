# TRIXTECH Frontend

Modern Next.js frontend for the TRIXTECH Event Booking System.

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
frontend/
├── app/                 # Next.js app directory
│   ├── page.tsx        # Home page
│   ├── layout.tsx      # Root layout
│   └── globals.css     # Global styles
├── components/         # Reusable React components
├── lib/               # Utility functions and contexts
├── public/            # Static assets
├── package.json       # Dependencies
└── tsconfig.json      # TypeScript configuration
\`\`\`

## Key Features

- ✅ User authentication (login/register)
- ✅ Service browsing
- ✅ Booking management
- ✅ Admin dashboard
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript support

## Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000
\`\`\`

## Commands

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
