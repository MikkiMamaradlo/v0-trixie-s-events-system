# Project Organization Guide

## Clean Project Structure

This project is now organized into two completely separate systems:

### Backend (Express.js)
Located in `/backend` folder

**Entry Point:** `npm start` runs `src/server.js`

**Structure:**
\`\`\`
backend/
├── src/
│   ├── server.js              # Main Express app
│   └── routes/                # API endpoints
│       ├── auth.js            # Authentication
│       ├── bookings.js        # Bookings management
│       ├── services.js        # Service listings
│       ├── inventory.js       # Inventory management
│       └── payments.js        # Payments
├── package.json               # Dependencies
├── .env                       # Configuration
└── README.md                  # Backend docs
\`\`\`

**Key Dependencies:**
- express - Web framework
- cors - Enable cross-origin requests
- dotenv - Environment configuration
- uuid - ID generation

### Frontend (Next.js)
Located in `/frontend` folder

**Entry Point:** `npm run dev` runs Next.js dev server

**Structure:**
\`\`\`
frontend/
├── src/
│   ├── app/                   # Next.js pages (routing)
│   │   ├── page.tsx          # Home page
│   │   ├── login/page.tsx    # Login page
│   │   ├── services/page.tsx # Services listing
│   │   ├── booking/[id]/page.tsx  # Booking form
│   │   └── bookings/page.tsx # User's bookings
│   ├── components/
│   │   ├── layout/           # Layout components
│   │   │   └── navigation.tsx
│   │   └── ui/               # UI components
│   ├── lib/
│   │   └── auth-context.tsx  # Auth state management
│   └── styles/
│       └── globals.css       # Global styles
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── next.config.mjs           # Next.js config
├── .env.local                # Configuration
└── README.md                 # Frontend docs
\`\`\`

**Key Dependencies:**
- next - React framework
- react - UI library
- tailwindcss - Styling
- lucide-react - Icons

## Communication

Frontend communicates with backend via HTTP API:

**Backend URL:** http://localhost:5000/api
**Frontend URL:** http://localhost:3000

Configuration in `frontend/.env.local`:
\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## Running Both Systems

**Essential:** Both must run simultaneously

1. **Backend:** `cd backend && npm start` (Port 5000)
2. **Frontend:** `cd frontend && npm run dev` (Port 3000)

Use two separate terminal windows or tabs.

## Data Flow

\`\`\`
User Browser (http://localhost:3000)
         ↓
    React App (Next.js)
         ↓
    API Calls
         ↓
    Backend Server (http://localhost:5000)
         ↓
    In-Memory Data Store
\`\`\`

Currently data is stored in memory. To add persistence:
1. Install MongoDB/PostgreSQL
2. Create database models
3. Replace in-memory arrays with database queries
4. Update API routes accordingly

## File Organization Best Practices

### Backend
- Keep routes focused and single-responsibility
- Add middleware in `src/middleware/`
- Add utilities in `src/utils/`
- Store constants in `src/config/`

### Frontend
- One page per file in `app/`
- Reusable components in `components/`
- Shared logic in `lib/`
- Styles in `styles/`

## Adding New Features

### Add New API Endpoint

1. Create new file in `backend/src/routes/feature.js`
2. Import and register in `backend/src/server.js`
3. Call from frontend using `fetch()` or axios

### Add New Page

1. Create new folder in `frontend/src/app/feature/`
2. Create `page.tsx` inside
3. Next.js automatically routes it

## Development Workflow

1. Make backend changes → Server auto-restarts (with `npm run dev`)
2. Make frontend changes → Browser auto-refreshes
3. Test via frontend UI or API calls
4. Commit changes with meaningful messages

## Troubleshooting

**Backend won't start:**
- Check port 5000 is free
- Run `npm install` if modules missing
- Check `.env` file exists

**Frontend won't connect:**
- Verify backend is running on port 5000
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Check browser console for errors

**Changes not reflecting:**
- Clear node_modules: `rm -rf node_modules package-lock.json`
- Restart dev server
- Clear browser cache

## Next Steps

1. Understand the clean separation
2. Review API endpoints in `backend/README.md`
3. Explore frontend pages in `frontend/src/app/`
4. Modify services/pricing as needed
5. Add database integration when ready
6. Deploy frontend and backend separately
\`\`\`
