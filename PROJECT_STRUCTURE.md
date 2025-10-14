# TRIXTECH Booking System - Complete File Structure

This document provides a comprehensive overview of all files in the TRIXTECH booking and reservation system. Use this as a reference for copying and organizing the codebase.

---

## 📁 Project Structure Overview

\`\`\`
trixtech-booking-system/
├── app/                          # Next.js App Router pages
│   ├── admin/                    # Admin dashboard section
│   │   ├── page.tsx             # Main admin dashboard
│   │   └── payments/            # Payment management
│   │       └── page.tsx         # Payment tracking page
│   ├── booking/                  # Booking flow
│   │   └── [id]/                # Dynamic booking by service ID
│   │       └── page.tsx         # Booking form with payment
│   ├── bookings/                 # Customer bookings list
│   │   ├── page.tsx             # View all customer bookings
│   │   └── loading.tsx          # Loading state
│   ├── login/                    # Customer login
│   │   └── page.tsx             # Customer login page
│   ├── services/                 # Services catalog
│   │   ├── page.tsx             # Browse all services
│   │   └── loading.tsx          # Loading state
│   ├── layout.tsx                # Root layout with navigation
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles & design tokens
│
├── components/                   # Reusable components
│   ├── admin/                    # Admin-specific components
│   │   ├── admin-login.tsx      # Admin login form
│   │   ├── bookings-management.tsx  # Manage bookings
│   │   ├── calendar-view.tsx    # Calendar with bookings
│   │   └── inventory-management.tsx # Inventory CRUD
│   ├── ui/                       # shadcn/ui components (auto-included)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── calendar.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── label.tsx
│   │   ├── popover.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── table.tsx
│   │   └── alert.tsx
│   └── navigation.tsx            # Main navigation bar
│
├── lib/                          # Utilities and context
│   ├── auth-context.tsx          # Authentication provider
│   └── utils.ts                  # Utility functions (cn, etc.)
│
├── hooks/                        # Custom React hooks
│   ├── use-mobile.tsx            # Mobile detection
│   └── use-toast.ts              # Toast notifications
│
├── public/                       # Static assets
│   ├── elegant-party-planning-setup.jpg
│   ├── birthday-party.png
│   ├── wedding-celebration.png
│   ├── corporate-event.png
│   ├── tables-chairs.png
│   ├── sound-system.png
│   ├── tent-canopy.png
│   ├── buffet-catering.png
│   ├── plated-dinner.png
│   └── cocktail-service.png
│
├── next.config.mjs               # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies (auto-generated)
\`\`\`

---

## 📄 File-by-File Breakdown

### **1. CORE PAGES (app/)**

#### `app/page.tsx` - Homepage
- Hero section with call-to-action
- Service category cards (Party Planning, Equipment Rental, Catering)
- CTA section for booking

#### `app/layout.tsx` - Root Layout
- Global layout wrapper
- Navigation component
- Authentication provider
- Font configuration (Geist Sans & Mono)

#### `app/globals.css` - Global Styles
- Tailwind CSS v4 configuration
- Design tokens (colors, spacing, radius)
- Light/dark mode variables

---

### **2. CUSTOMER INTERFACE (app/)**

#### `app/services/page.tsx` - Services Catalog
- Browse all services with filtering
- Category tabs (All, Party Planning, Equipment, Catering)
- Service cards with pricing and details
- Links to booking pages

#### `app/services/loading.tsx` - Loading State
- Skeleton loader for services page

#### `app/booking/[id]/page.tsx` - Booking Form
- Two-step booking process:
  1. Customer details (name, email, phone, date, guests)
  2. Payment information (card details)
- Dynamic pricing calculation
- Form validation
- Saves to localStorage

#### `app/bookings/page.tsx` - My Bookings
- View all customer bookings
- Filter by status (pending, confirmed, cancelled)
- Booking details display
- Success message after booking

#### `app/bookings/loading.tsx` - Loading State
- Skeleton loader for bookings page

#### `app/login/page.tsx` - Customer Login
- Email/password login form
- Demo authentication (any credentials work)
- Redirects to services after login

---

### **3. ADMIN DASHBOARD (app/admin/)**

#### `app/admin/page.tsx` - Admin Dashboard
- Protected route (requires admin login)
- Statistics cards (total bookings, pending, confirmed, revenue)
- Three main tabs:
  1. Bookings Management
  2. Inventory Management
  3. Calendar View
- Real-time data from localStorage

#### `app/admin/payments/page.tsx` - Payment Management
- Revenue statistics
- Transaction history table
- Payment status tracking
- Filter by payment status

---

### **4. ADMIN COMPONENTS (components/admin/)**

#### `components/admin/admin-login.tsx` - Admin Login Form
- Password-only login (password: "admin123")
- Error handling
- Loading states

#### `components/admin/bookings-management.tsx` - Bookings Management
- View all bookings in table format
- Update booking status (pending → confirmed → cancelled)
- Filter by status
- Expandable booking details
- Customer contact information

#### `components/admin/inventory-management.tsx` - Inventory Management
- Full CRUD operations for inventory items
- Add new equipment/supplies
- Edit existing items
- Delete items
- Track quantity, condition, price
- Category organization

#### `components/admin/calendar-view.tsx` - Calendar View
- Visual calendar with booking dates highlighted
- Click date to see bookings
- Color-coded by status
- Monthly navigation

---

### **5. SHARED COMPONENTS (components/)**

#### `components/navigation.tsx` - Navigation Bar
- Logo and site title
- Navigation links (Home, Services, Bookings, Admin)
- User authentication status
- Login/Logout dropdown
- Responsive mobile menu

---

### **6. AUTHENTICATION & STATE (lib/)**

#### `lib/auth-context.tsx` - Authentication Provider
- React Context for auth state
- Customer login function
- Admin login function
- Logout function
- Persists auth to localStorage
- Provides `useAuth()` hook

#### `lib/utils.ts` - Utility Functions
- `cn()` function for conditional class names
- Other helper utilities

---

### **7. CUSTOM HOOKS (hooks/)**

#### `hooks/use-mobile.tsx` - Mobile Detection
- Detects mobile viewport
- Returns boolean for responsive logic

#### `hooks/use-toast.ts` - Toast Notifications
- Toast notification system
- Success/error messages

---

### **8. UI COMPONENTS (components/ui/)**

All shadcn/ui components are auto-included:
- `button.tsx` - Button component
- `card.tsx` - Card layouts
- `input.tsx` - Form inputs
- `badge.tsx` - Status badges
- `calendar.tsx` - Date picker
- `dialog.tsx` - Modal dialogs
- `dropdown-menu.tsx` - Dropdown menus
- `label.tsx` - Form labels
- `popover.tsx` - Popover overlays
- `select.tsx` - Select dropdowns
- `tabs.tsx` - Tab navigation
- `textarea.tsx` - Text areas
- `table.tsx` - Data tables
- `alert.tsx` - Alert messages

---

## 🎨 Design System

### Color Palette
- **Primary**: Dark neutral (for buttons, headers)
- **Secondary**: Light gray (for backgrounds)
- **Muted**: Subtle gray (for secondary text)
- **Accent**: Highlight color (for interactive elements)
- **Destructive**: Red (for errors, cancellations)

### Typography
- **Headings**: Geist Sans (bold weights)
- **Body**: Geist Sans (regular weight)
- **Code**: Geist Mono

### Layout
- Container max-width: 1280px
- Responsive breakpoints: sm, md, lg, xl
- Flexbox-first approach
- Grid for service cards

---

## 🔐 Authentication Flow

### Customer Authentication
1. Navigate to `/login`
2. Enter any email/password (demo mode)
3. Redirects to `/services`
4. Can view bookings at `/bookings`

### Admin Authentication
1. Navigate to `/admin`
2. Enter password: `admin123`
3. Access admin dashboard
4. Manage bookings, inventory, payments

---

## 💾 Data Storage

All data is stored in **localStorage** (no database required):

### Storage Keys
- `auth` - Authentication state
- `bookings` - All customer bookings
- `inventory` - Equipment and supplies inventory
- `payments` - Payment transactions

### Data Structures

**Booking Object:**
\`\`\`typescript
{
  id: number
  serviceId: number
  serviceName: string
  serviceCategory: string
  customerName: string
  email: string
  phone: string
  date: string
  guests: number
  specialRequests: string
  status: "pending" | "confirmed" | "cancelled"
  totalPrice: number
  createdAt: string
}
\`\`\`

**Inventory Item:**
\`\`\`typescript
{
  id: number
  name: string
  category: "party-planning" | "equipment-rental" | "catering"
  quantity: number
  available: number
  price: number
  condition: "excellent" | "good" | "fair"
  lastMaintenance: string
}
\`\`\`

**Payment Transaction:**
\`\`\`typescript
{
  id: number
  bookingId: number
  amount: number
  status: "completed" | "pending" | "failed"
  paymentMethod: string
  transactionDate: string
}
\`\`\`

---

## 🚀 Getting Started

### Installation
1. Download the ZIP or clone from GitHub
2. Run: `npx shadcn@latest init` (if starting fresh)
3. Run: `npm install`
4. Run: `npm run dev`
5. Open: `http://localhost:3000`

### Default Credentials
- **Admin Password**: `admin123`
- **Customer Login**: Any email/password works (demo mode)

---

## 📋 Features Checklist

### Customer Features
- ✅ Browse services by category
- ✅ View detailed service information
- ✅ Book services with date selection
- ✅ Enter customer details
- ✅ Payment form (mock)
- ✅ View booking history
- ✅ Customer authentication

### Admin Features
- ✅ Admin authentication
- ✅ Dashboard with statistics
- ✅ Manage all bookings
- ✅ Update booking status
- ✅ Inventory management (CRUD)
- ✅ Calendar view of bookings
- ✅ Payment tracking
- ✅ Revenue statistics

---

## 🎯 Key Technologies

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **State Management**: React Context + localStorage
- **Fonts**: Geist Sans & Geist Mono

---

## 📝 Notes

- No database required - uses localStorage for demo purposes
- No real payment processing - UI demonstration only
- Authentication is mock/demo - not production-ready
- All data persists in browser localStorage
- Responsive design works on mobile, tablet, desktop

---

## 🔄 Next Steps for Production

To make this production-ready, you would need to:

1. **Add Database**: Integrate Supabase, Neon, or PostgreSQL
2. **Real Authentication**: Implement proper auth (Supabase Auth, NextAuth, etc.)
3. **Payment Processing**: Integrate Stripe or similar
4. **API Routes**: Create server-side API endpoints
5. **Email Notifications**: Send booking confirmations
6. **File Uploads**: Allow image uploads for services
7. **Search & Filters**: Advanced search functionality
8. **Analytics**: Track bookings and revenue
9. **Security**: Add proper validation and sanitization
10. **Deployment**: Deploy to Vercel or similar platform

---

**End of Structure Document**
