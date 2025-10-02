# Authentication System Documentation

## Overview

This Nike-style e-commerce application features a robust authentication system built with Better Auth, PostgreSQL, and Drizzle ORM. The system supports both authenticated users and guests, with seamless guest-to-user transitions during login/signup.

## Architecture

### Stack

- **Database**: PostgreSQL with Neon
- **ORM**: Drizzle ORM with modular schemas
- **Authentication**: Better Auth with custom server actions
- **Framework**: Next.js 15 (App Router)
- **Validation**: Zod for input validation
- **Security**: bcryptjs for password hashing

### Database Schema

#### Core Tables

1. **`user`** - User accounts

   - `id`: UUID primary key
   - `name`: Optional display name
   - `email`: Unique email address
   - `emailVerified`: Boolean (default: false)
   - `image`: Optional profile image URL
   - `createdAt`/`updatedAt`: Timestamps

2. **`session`** - User sessions

   - `id`: UUID primary key
   - `userId`: Foreign key to user
   - `token`: Unique session token
   - `ipAddress`/`userAgent`: Session metadata
   - `expiresAt`: Session expiration
   - `createdAt`/`updatedAt`: Timestamps

3. **`account`** - Authentication providers

   - `id`: UUID primary key
   - `userId`: Foreign key to user
   - `accountId`: Provider-specific account ID
   - `providerId`: Provider type (credentials, google, apple)
   - `password`: Hashed password (credentials only)
   - OAuth tokens and metadata
   - `createdAt`/`updatedAt`: Timestamps

4. **`verification`** - Email verification tokens

   - `id`: UUID primary key
   - `identifier`: Email address
   - `value`: Verification token
   - `expiresAt`: Token expiration
   - `createdAt`/`updatedAt`: Timestamps

5. **`guest`** - Guest sessions
   - `id`: UUID primary key
   - `sessionToken`: Unique guest session token
   - `createdAt`/`expiresAt`: Session lifecycle

## Features

### Authentication Methods

- **Email/Password**: Standard credential-based authentication
- **Social OAuth**: Google and Apple (configured but not implemented in MVP)
- **Guest Sessions**: Anonymous browsing with cart persistence

### Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Secure HTTP-only cookies
- **Input Validation**: Zod schemas for all user inputs
- **CSRF Protection**: SameSite cookie settings
- **Session Expiry**: Automatic cleanup of expired sessions

### Guest-to-User Migration

- Seamless cart migration when guests sign up/login
- Session token transfer
- Data preservation during authentication

## API Endpoints

### Better Auth Routes

- `GET/POST /api/auth/[...all]` - Better Auth handler

### Server Actions

- `signUp(formData)` - Create new user account
- `signIn(formData)` - Authenticate existing user
- `signOut()` - End user session
- `createGuestSession()` - Create anonymous session
- `getGuestSession()` - Validate guest session
- `getCurrentUser()` - Get authenticated user
- `mergeGuestCartWithUserCart()` - Migrate guest data

## Usage Examples

### Sign Up

```typescript
import { signUp } from "@/lib/auth/actions";

const formData = new FormData();
formData.append("name", "John Doe");
formData.append("email", "john@example.com");
formData.append("password", "securepassword");

const result = await signUp(formData);
if (result.success) {
  // User created successfully
  console.log("User ID:", result.data?.userId);
}
```

### Sign In

```typescript
import { signIn } from "@/lib/auth/actions";

const formData = new FormData();
formData.append("email", "john@example.com");
formData.append("password", "securepassword");

const result = await signIn(formData);
if (result.success) {
  // User authenticated successfully
  console.log("User ID:", result.data?.userId);
}
```

### Check Authentication

```typescript
import { getCurrentUser } from "@/lib/auth/actions";

const result = await getCurrentUser();
if (result.success && result.data) {
  console.log("Authenticated user:", result.data.user);
} else {
  console.log("Not authenticated");
}
```

## Environment Variables

Required environment variables:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Optional OAuth (for future implementation)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret
```

## Database Setup

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Set up environment variables**:

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and secrets
   ```

3. **Run database migrations**:

   ```bash
   source .env.local && npm run db:push
   ```

4. **Start development server**:
   ```bash
   source .env.local && npm run dev
   ```

## Route Protection

The application uses middleware for route protection:

- **Public Routes**: `/`, `/sign-in`, `/sign-up`, `/api/auth`, `/api/products`
- **Protected Routes**: All other routes require authentication
- **Guest Access**: Product browsing and cart functionality available without authentication
- **Checkout Protection**: Redirects to sign-in when proceeding to checkout without authentication

## Security Considerations

1. **Password Security**: Passwords are hashed with bcryptjs (12 salt rounds)
2. **Session Security**: HTTP-only, secure, SameSite cookies
3. **Input Validation**: All user inputs validated with Zod schemas
4. **SQL Injection**: Protected by Drizzle ORM parameterized queries
5. **CSRF Protection**: SameSite cookie policy
6. **Session Management**: Automatic cleanup of expired sessions

## Future Enhancements

1. **Email Verification**: Implement email verification flow
2. **Password Reset**: Add password reset functionality
3. **Two-Factor Authentication**: Add 2FA support
4. **Social OAuth**: Complete Google and Apple OAuth implementation
5. **Role-Based Access**: Add user roles and permissions
6. **Audit Logging**: Track authentication events

## Troubleshooting

### Common Issues

1. **Database Connection**: Ensure `DATABASE_URL` is correctly set
2. **Session Issues**: Check cookie settings and domain configuration
3. **Build Errors**: Ensure all dependencies are installed
4. **Type Errors**: Verify schema exports and imports

### Debug Mode

Enable debug logging by setting:

```env
BETTER_AUTH_DEBUG=true
```

## Support

For issues or questions regarding the authentication system, please refer to:

- [Better Auth Documentation](https://better-auth.com)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Next.js Documentation](https://nextjs.org/docs)
