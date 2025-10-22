# TODO: Implement MongoDB Backend for TRIXTECH Event Booking System

## Pending Tasks

### Phase 1: Setup and Dependencies

- [ ] Install MongoDB/Mongoose dependencies (mongoose, bcryptjs, jsonwebtoken, dotenv)
- [ ] Create .env file with MongoDB connection string and JWT secret
- [ ] Create database connection utility (lib/mongodb.ts)
- [ ] Update server.js to connect to MongoDB on startup

### Phase 2: Database Models

- [ ] Create User model (models/User.ts) - customers and admin
- [ ] Create Booking model (models/Booking.ts)
- [ ] Create Inventory model (models/Inventory.ts)
- [ ] Create Payment model (models/Payment.ts)

### Phase 3: Authentication APIs

- [ ] Create POST /api/auth/login (customer login)
- [ ] Create POST /api/auth/admin-login (admin login)
- [ ] Create POST /api/auth/signup (customer signup)
- [ ] Create POST /api/auth/logout
- [ ] Create GET /api/auth/me (get current user)

### Phase 4: Booking APIs

- [ ] Create GET /api/bookings (get user's bookings)
- [ ] Create POST /api/bookings (create new booking)
- [ ] Create GET /api/bookings/[id] (get booking details)
- [ ] Create PUT /api/bookings/[id] (update booking status - admin only)
- [ ] Create GET /api/admin/bookings (get all bookings - admin only)

### Phase 5: Inventory APIs

- [ ] Create GET /api/inventory (get all inventory)
- [ ] Create POST /api/inventory (create inventory item - admin only)
- [ ] Create PUT /api/inventory/[id] (update inventory item - admin only)
- [ ] Create DELETE /api/inventory/[id] (delete inventory item - admin only)

### Phase 6: Payment APIs

- [ ] Create GET /api/payments (get all payments - admin only)
- [ ] Create POST /api/payments (create payment record)
- [ ] Create PUT /api/payments/[id] (update payment status - admin only)

### Phase 7: User Management APIs

- [ ] Create GET /api/admin/users (get all users - admin only)
- [ ] Create PUT /api/admin/users/[id] (update user - admin only)
- [ ] Create DELETE /api/admin/users/[id] (delete user - admin only)

### Phase 8: Frontend Updates

- [ ] Update lib/auth-context.tsx to use JWT and API calls
- [ ] Update all components using localStorage to use API calls
- [ ] Update WebSocket integration to work with database
- [ ] Add loading states and error handling for API calls
- [ ] Update booking creation to call API and notify via WebSocket

### Phase 9: Testing and Migration

- [ ] Test all API endpoints
- [ ] Test authentication flow (customer and admin)
- [ ] Test booking creation and management
- [ ] Test inventory management
- [ ] Test payment tracking
- [ ] Update README with MongoDB setup instructions
- [ ] Add database seeding script for initial data

### Phase 10: Production Considerations

- [ ] Add input validation and sanitization
- [ ] Add rate limiting to APIs
- [ ] Add proper error handling and logging
- [ ] Add database indexes for performance
- [ ] Update deployment instructions

## Completed Tasks

- [x] Analyze current localStorage-based system
- [x] Create comprehensive implementation plan
- [x] Get user approval for MongoDB backend implementation
