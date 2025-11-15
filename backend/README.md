# TRIXTECH Backend

Express.js backend API for the TRIXTECH Event Booking System.

## Quick Start

\`\`\`bash
# Install dependencies
npm install

# Run development server (with auto-reload)
npm run dev

# Or run production server
node server.js
\`\`\`

Server will run on `http://localhost:5000`

## Project Structure

\`\`\`
backend/
├── routes/              # API route handlers
│   ├── bookings.js     # Booking endpoints
│   ├── services.js     # Service endpoints
│   ├── inventory.js    # Inventory endpoints
│   ├── auth.js         # Authentication endpoints
│   └── payments.js     # Payment endpoints
├── server.js           # Express server setup
├── package.json        # Dependencies
└── .env               # Environment variables
\`\`\`

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `GET /api/bookings/:id` - Get booking by ID
- `POST /api/bookings` - Create new booking
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Delete booking

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID
- `GET /api/services/category/:category` - Get services by category

### Inventory
- `GET /api/inventory` - Get all items
- `GET /api/inventory/:id` - Get item by ID
- `POST /api/inventory` - Create item
- `PUT /api/inventory/:id` - Update item
- `DELETE /api/inventory/:id` - Delete item

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Payments
- `GET /api/payments` - Get all payments
- `POST /api/payments` - Create payment
- `GET /api/payments/:id` - Get payment by ID

## Health Check

\`\`\`bash
curl http://localhost:5000/health
\`\`\`

## Dependencies

- **express** - Web framework
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **uuid** - Generate unique IDs
- **nodemon** - Auto-reload (dev only)

## Environment Variables

See `.env` file for all available options.
