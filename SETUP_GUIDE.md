# TRIXTECH Booking System - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Visual Studio Code** (recommended) or any code editor

## Installation Steps

### 1. Clone or Download the Project

If you have the project as a ZIP file:
\`\`\`bash
# Extract the ZIP file to your desired location
# Navigate to the project directory
cd v0-trixie-s-events-system
\`\`\`

### 2. Install Dependencies

Open your terminal in the project root directory and run:

\`\`\`bash
npm install
\`\`\`

Or if you prefer yarn:

\`\`\`bash
yarn install
\`\`\`

This will install all required dependencies listed in `package.json`.

### 3. Start the Development Server

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Or with yarn:

\`\`\`bash
yarn dev
\`\`\`

The application will start on `http://localhost:3000`

### 4. Open in Browser

Navigate to `http://localhost:3000` in your web browser to see the application.

## Project Structure

\`\`\`
v0-trixie-s-events-system/
├── app/                      # Next.js app directory
│   ├── admin/               # Admin dashboard pages
│   │   ├── page.tsx        # Main admin dashboard
│   │   └── payments/       # Payment management
│   ├── booking/            # Booking pages
│   │   └── [id]/          # Dynamic booking page
│   ├── bookings/           # User bookings list
│   ├── login/              # Login page
│   ├── services/           # Services catalog
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   └── globals.css         # Global styles
├── components/              # React components
│   ├── admin/              # Admin-specific components
│   ├── ui/                 # UI components (shadcn)
│   ├── navigation.tsx      # Navigation bar
│   └── theme-provider.tsx  # Theme provider
├── lib/                     # Utility functions
│   ├── auth-context.tsx    # Authentication context
│   └── utils.ts            # Helper functions
├── public/                  # Static assets
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── next.config.mjs         # Next.js config
\`\`\`

## Default Credentials

### Admin Access
- **Password**: `admin123`
- Access the admin dashboard at `/admin`

### Customer Login
- Any email and password combination works for demo purposes
- Customer accounts are stored in browser localStorage

## Features Overview

### Customer Features
1. **Browse Services** - View all available services (party planning, equipment rental, catering)
2. **Book Services** - Select a service and fill out booking details
3. **Payment Processing** - Complete mock payment with card details
4. **View Bookings** - See all your bookings and their status

### Admin Features
1. **Dashboard** - Overview of bookings, revenue, and statistics
2. **Bookings Management** - View and update booking statuses
3. **Inventory Management** - Add, edit, and delete inventory items
4. **Calendar View** - Visual calendar of all bookings
5. **Payment Management** - Track revenue and payment status

## Data Storage

This application uses **localStorage** for data persistence:
- Bookings are stored in `localStorage.getItem("bookings")`
- Inventory items in `localStorage.getItem("inventory")`
- Authentication state in `localStorage.getItem("auth")`

**Note**: Data will be cleared if you clear browser cache/localStorage.

## Common Issues & Solutions

### Issue: Port 3000 is already in use
**Solution**: Either stop the process using port 3000, or run on a different port:
\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### Issue: Module not found errors
**Solution**: Delete `node_modules` and reinstall:
\`\`\`bash
rm -rf node_modules
npm install
\`\`\`

### Issue: TypeScript errors
**Solution**: The project is configured to ignore build errors for development. If you want strict type checking, modify `next.config.mjs`:
\`\`\`javascript
typescript: {
  ignoreBuildErrors: false,
}
\`\`\`

### Issue: Styles not loading
**Solution**: Ensure Tailwind CSS is properly configured. Try clearing the Next.js cache:
\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

## Building for Production

To create a production build:

\`\`\`bash
npm run build
npm start
\`\`\`

Or with yarn:

\`\`\`bash
yarn build
yarn start
\`\`\`

## Development Tips

1. **Hot Reload**: The dev server supports hot reload - changes will reflect automatically
2. **Console Logs**: Check browser console for any errors or warnings
3. **React DevTools**: Install React DevTools browser extension for debugging
4. **VS Code Extensions**: Recommended extensions:
   - ESLint
   - Prettier
   - Tailwind CSS IntelliSense
   - TypeScript and JavaScript Language Features

## Customization

### Changing Colors
Edit `app/globals.css` to modify the color scheme:
\`\`\`css
@theme inline {
  --color-primary: /* your color */;
  --color-secondary: /* your color */;
}
\`\`\`

### Adding New Services
Edit `app/services/page.tsx` and add to the `services` array.

### Modifying Admin Password
Edit `components/admin/admin-login.tsx` and change the password check logic.

## Support

For issues or questions:
1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure you're using Node.js 18 or higher
4. Clear browser cache and localStorage if experiencing data issues

## Next Steps

1. **Add Database**: Integrate Supabase or another database for persistent storage
2. **Real Authentication**: Implement proper authentication with NextAuth.js or Supabase Auth
3. **Payment Gateway**: Integrate Stripe for real payment processing
4. **Email Notifications**: Add email confirmations for bookings
5. **File Uploads**: Allow users to upload images or documents

---

**Version**: 1.0.0  
**Last Updated**: 2025
