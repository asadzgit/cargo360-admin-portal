# Cargo360 API Integration - Admin Panel

This document describes the API integration implementation for the Cargo360 admin panel.

## Overview

The admin panel integrates with the Cargo360 API to manage shipments (bookings/orders) and users. The implementation includes authentication, CRUD operations, and real-time data management.

## API Configuration

### Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Cargo360 API Configuration
REACT_APP_API_BASE_URL=http://localhost:4000

# Environment
REACT_APP_ENVIRONMENT=development

# Optional: Enable debug mode
REACT_APP_DEBUG=true
```

### Base URL

- **Development**: `http://localhost:4000`
- **Production**: Update `REACT_APP_API_BASE_URL` to your production API URL

## Authentication

### Admin Role Requirement

This admin panel requires users to have the `admin` role. The authentication system:

1. Validates user credentials via `/auth/login`
2. Stores JWT tokens in localStorage
3. Automatically refreshes tokens when needed
4. Restricts access to admin users only

### Login Process

```javascript
// Login with email and password
const result = await authService.login(email, password)
```

## API Services

### Authentication Service (`authService`)

- `login(email, password)` - Authenticate admin user
- `getProfile()` - Get current user profile
- `refreshToken()` - Refresh access token
- `logout()` - Clear authentication data
- `isAuthenticated()` - Check authentication status

### Shipments Service (`shipmentsService`)

- `getAllShipments(filters)` - Get all shipments with optional filters
- `getShipmentById(id)` - Get single shipment details
- `deleteShipment(id)` - Delete shipment (admin only)
- `updateShipmentStatus(id, status)` - Update shipment status
- `getShipmentStats()` - Get shipment statistics

### Users Service (`usersService`)

- `getAllUsers(filters)` - Get all users with optional filters
- `getUserById(id)` - Get single user details
- `deleteUser(id)` - Delete user (admin only)
- `updateUserRole(id, role)` - Update user role
- `updateUserApproval(id, isApproved)` - Approve/block user
- `createUser(userData)` - Create new user
- `getUserStats()` - Get user statistics

## State Management

### Context Providers

The app uses React Context for state management:

- **AuthContext**: Manages authentication state and user data
- **AppContext**: Manages application data (shipments, users, loading states, errors)

### Usage Example

```javascript
import { useAuth } from '../contexts/AuthContext'
import { useApp } from '../contexts/AppContext'

const MyComponent = () => {
  const { user, login, logout } = useAuth()
  const { shipments, users, loading, error, dispatch } = useApp()
  
  // Component logic
}
```

## Protected Routes

All admin routes are protected using the `ProtectedRoute` component:

- Checks authentication status
- Verifies admin role
- Redirects to login if unauthorized
- Shows access denied for non-admin users

## Pages and Features

### Dashboard (`/`)

- Overview of system statistics
- Quick navigation to users and orders

### Orders/Shipments (`/orders`)

- View all shipments with filtering options
- Status-based filtering (pending, accepted, delivered, etc.)
- Accept/decline pending shipments
- Delete shipments
- Real-time status updates

### Users (`/users`)

- View all users with role-based filtering
- Create new users
- Update user roles
- Approve/block users
- Delete users

## API Endpoints Used

### Authentication
- `POST /auth/login` - User login
- `GET /auth/me` - Get user profile
- `POST /auth/refresh` - Refresh token

### Shipments
- `GET /shipments` - Get all shipments (admin)
- `GET /shipments/:id` - Get single shipment
- `DELETE /shipments/:id` - Delete shipment (admin)
- `PATCH /shipments/:id/status` - Update shipment status

### Users
- `GET /users` - Get all users (admin)
- `GET /users/:id` - Get single user
- `POST /auth/signup` - Create new user
- `DELETE /users/:id` - Delete user (admin)
- `PATCH /users/:id/role` - Update user role (admin)
- `PATCH /users/:id/approval` - Update user approval (admin)

## Error Handling

The implementation includes comprehensive error handling:

- API request failures are caught and displayed as toast notifications
- Loading states are shown during API calls
- Error states are displayed in the UI
- Network errors are handled gracefully

## Data Transformation

The API data is transformed to match the UI requirements:

### Shipments
- API `shipment` objects are transformed to display format
- Status values are mapped to UI-friendly labels
- Date formatting for display

### Users
- Role-based styling and filtering
- Status indicators for approval and verification
- Date formatting for join dates

## Security Features

- JWT token-based authentication
- Automatic token refresh
- Role-based access control
- Protected routes
- Secure token storage in localStorage

## Development Setup

1. Install dependencies: `npm install`
2. Create `.env` file with API configuration
3. Start development server: `npm start`
4. Ensure Cargo360 API is running on configured URL

## Production Deployment

1. Update `REACT_APP_API_BASE_URL` to production API URL
2. Build the application: `npm run build`
3. Deploy the built files to your hosting platform
4. Ensure CORS is configured on the API server

## Troubleshooting

### Common Issues

1. **Authentication Errors**: Check API URL and credentials
2. **CORS Errors**: Ensure API server allows requests from your domain
3. **Token Expiry**: The app automatically handles token refresh
4. **Role Access**: Ensure user has `admin` role in the API

### Debug Mode

Enable debug mode by setting `REACT_APP_DEBUG=true` in your `.env` file for additional console logging.

## Future Enhancements

- Real-time updates using WebSockets
- Advanced filtering and search
- Export functionality for data
- Bulk operations for shipments and users
- Dashboard analytics and charts
