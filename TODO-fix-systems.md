# Comprehensive System Fix: Transition from localStorage to MongoDB Backend

## Information Gathered

- Auth context uses localStorage for authentication instead of JWT tokens
- Admin panel loads booking data from localStorage instead of MongoDB API
- WebSocket notifications send to all authenticated clients (admins + customers) instead of just admins
- Many components still use localStorage for data persistence
- Data structure mismatches between WebSocket notifications and admin panel expectations

## Plan

### Phase 1: Authentication System Fix

- [x] Update lib/auth-context.tsx to use JWT tokens from API endpoints
- [ ] Remove localStorage dependency from auth context
- [ ] Update login/signup components to use API calls
- [ ] Update admin login to use JWT tokens

### Phase 2: WebSocket Notification Fix

- [x] Update server.js notifyNewBooking method to only send to admin clients
- [ ] Remove customer notification logic
- [ ] Update console logging to reflect admin-only notifications

### Phase 3: Admin Panel API Integration

- [ ] Update app/admin/page.tsx to fetch bookings from API instead of localStorage
- [ ] Update components/admin/bookings-management.tsx to use API calls
- [ ] Update components/admin/inventory-management.tsx to use API calls
- [ ] Update components/admin/user-management.tsx to use API calls

### Phase 4: User Components API Integration

- [ ] Update app/dashboard/page.tsx to use API calls
- [ ] Update app/bookings/page.tsx to use API calls
- [ ] Update app/booking/[id]/page.tsx to use API calls
- [ ] Update user feedback and service components to use API calls

### Phase 5: Data Structure Alignment

- [ ] Ensure WebSocket notification data matches admin panel expectations
- [ ] Update booking creation flow to properly notify admins
- [ ] Test complete booking flow from creation to admin notification

## Dependent Files to Edit

### Auth System

- `lib/auth-context.tsx`: Replace localStorage with JWT token management
- `app/login/page.tsx`: Update to use API login
- `app/signup/page.tsx`: Update to use API signup
- `components/admin/admin-login.tsx`: Update to use JWT tokens

### WebSocket

- `server.js`: Fix notifyNewBooking to admin-only notifications

### Admin Components

- `app/admin/page.tsx`: Replace localStorage with API calls
- `components/admin/bookings-management.tsx`: API integration
- `components/admin/inventory-management.tsx`: API integration
- `components/admin/user-management.tsx`: API integration
- `components/admin/service-management.tsx`: API integration
- `components/admin/package-management.tsx`: API integration
- `components/admin/supply-management.tsx`: API integration
- `components/admin/feedback-management.tsx`: API integration

### User Components

- `app/dashboard/page.tsx`: API integration
- `app/bookings/page.tsx`: API integration
- `app/booking/[id]/page.tsx`: API integration
- `components/user/feedback-form.tsx`: API integration
- `components/user/packages-list.tsx`: API integration
- `components/user/services-list.tsx`: API integration

## Followup Steps

- Test authentication flow (customer and admin login/signup)
- Test booking creation and admin notification
- Test admin panel data loading from MongoDB
- Test WebSocket real-time notifications
- Verify all localStorage dependencies are removed
