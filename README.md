# Parmail Portal UI

EPIC 1: User Portal Frontend (React SPA) — A modern React TypeScript application for managing USPS Informed Delivery emails.

## Overview

Parmail Portal UI is the frontend component of the Parmail system. It provides users with:

- User authentication (signup, login, email verification)
- Dashboard to view and filter mail pieces
- USPS Informed Delivery enrollment wizard
- Unsubscribe management with reason tracking
- User settings and preferences
- Responsive mobile-first design

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type-safe development
- **Vite 8** - Lightning-fast build tool
- **React Router 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Axios** - HTTP client for API communication

## Project Structure

```
src/
├── pages/                    # Page components (full-page views)
│   ├── LoginPage.tsx
│   ├── SignupPage.tsx
│   ├── VerifyEmailPage.tsx
│   ├── DashboardPage.tsx
│   └── SettingsPage.tsx
├── components/              # Reusable UI components
│   ├── Navigation.tsx
│   ├── MailPieceCard.tsx
│   ├── UnsubscribeModal.tsx
│   └── USPSWizard.tsx
├── api/
│   └── client.ts           # Axios-based API client
├── context/
│   └── AuthContext.tsx     # Authentication state management
├── hooks/
│   └── useMailPieces.ts    # Custom hook for mail piece operations
├── types/
│   └── index.ts            # TypeScript type definitions
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
└── index.css               # Global styles (Tailwind)
```

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. Clone the repository:

git clone https://github.com/chb0github/parmail-portal-ui.git
cd parmail-portal-ui

2. Install dependencies:

npm install

3. Create a `.env` file from the template:

cp .env.example .env

4. Update `.env` with your API URL (default: `http://localhost:3001/api`):

REACT_APP_API_URL=http://localhost:3001/api

### Development

Start the development server with HMR:

npm run dev

The app will be available at `http://localhost:5173`

### Production Build

Build for production:

npm run build

This generates optimized files in the `dist/` directory ready for deployment.

Preview the production build:

npm run preview

## Features

### Authentication Flow

1. **Sign Up** - New users create an account with email, password, and phone
2. **Email Verification** - Users verify their email with a 6-digit code
3. **Login** - Returning users sign in with credentials
4. **Session Management** - JWT tokens stored in localStorage; auto-logout on 401

### Dashboard

- **Mail Piece Display** - Cards showing sender, mail type, date, and images
- **Filtering** - Filter by mail type (advertising, financial, personal, government, other)
- **Unsubscribe** - Request to unsubscribe with optional reason tracking
- **Mock Data** - Demo data included for development

### USPS Integration Wizard

4-step wizard for USPS enrollment:
1. Confirmation step
2. Phone verification
3. Optional driver's license upload
4. Review and confirm

### Settings Page

- Account information display
- User preferences (image display, auto-update, mail retention)
- Notification preferences
- USPS integration status
- Privacy and security options
- Account deletion

## API Integration

The app communicates with a backend API (not included) via the `ApiClient` class in `src/api/client.ts`.

### Expected API Endpoints

**Authentication:**
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/verify` - Verify email
- `POST /api/auth/send-verification` - Resend verification code
- `POST /api/auth/logout` - Sign out

**User:**
- `GET /api/user/profile` - Get user info
- `PATCH /api/user/profile` - Update user
- `GET /api/user/mail` - List mail pieces (paginated)
- `GET /api/user/mail/{id}` - Get mail piece details
- `POST /api/user/mail/unsubscribe` - Unsubscribe from sender

**USPS:**
- `POST /api/user/usps/enroll` - Start enrollment
- `POST /api/user/usps/complete` - Complete enrollment
- `GET /api/user/usps/status` - Check enrollment status

### Response Format

All endpoints return JSON. Errors include a `message` field:

```json
{
  "message": "Invalid credentials"
}
```

Authentication uses Bearer tokens:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Styling

The app uses **Tailwind CSS 4** with a utility-first approach. Key color palette:

- **Blue** - Primary actions (login, submit)
- **Green** - Success states
- **Red** - Danger/unsubscribe actions
- **Gray** - Neutral/background

For updates, edit `tailwind.config.js` or use Tailwind's `@apply` directive in `src/index.css`.

## Type Safety

All API responses are typed via `src/types/index.ts`. Core types:

- `User` - User account
- `Address` - Address with resolution status
- `MailPiece` - Individual mail piece
- `EmailManifest` - Container for multiple pieces
- `AuthResponse` - Login/signup response

## Authentication State Management

The `AuthContext` provides global auth state:

```tsx
const { user, isAuthenticated, login, logout, register, verifyEmail } = useAuth();
```

Private routes are protected with the `PrivateRoute` component.

## Development Features

- **HMR (Hot Module Replacement)** - Instant code updates
- **Type Checking** - Strict TypeScript configuration
- **Linting** - Oxlint for code quality
- **Source Maps** - Easy debugging in dev tools

## Building & Deployment

### Local Build

npm run build

### Deployment

1. Build the project (see above)
2. Deploy the `dist/` folder to your hosting service:
   - Vercel: Connect repo directly
   - Netlify: Drag and drop `dist/`
   - AWS S3 + CloudFront: Upload `dist/` to S3
   - Any static host: Serve `dist/index.html` as root

### Environment Variables for Deployment

Set `REACT_APP_API_URL` to your production backend URL during build:

REACT_APP_API_URL=https://api.parmail.io npm run build

## Known Limitations

- **Mock Data** - Dashboard currently uses mock mail pieces for demo
- **Image Handling** - Images use placeholder URLs; backend will provide real URLs
- **Offline Support** - No offline caching yet
- **Dark Mode** - Not implemented (Tailwind ready for extension)

## Next Steps

1. Connect to backend API (implement endpoints above)
2. Add dark mode support
3. Implement real-time notifications
4. Add mail piece detail view with full image display
5. Implement address book/saved senders
6. Add export functionality (CSV, PDF)

## Contributing

This is part of the Parmail project. Follow the main project's contribution guidelines.

## License

Proprietary - Parmail Project
