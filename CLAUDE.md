# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a SvelteKit web application for Cub Scout Pack 118 (Elk Grove, CA). It includes a public-facing informational website and a comprehensive scout finance management system with role-based authentication.

## Common Commands

### Development
```bash
npm run dev              # Start dev server (port 5173)
npm run build            # Build for production (runs prisma generate first)
npm run preview          # Preview production build
```

### Type Checking
```bash
npm run check            # Run svelte-check with TypeScript
npm run check:watch      # Watch mode for type checking
```

### Testing
```bash
npm test                 # Run all Playwright tests
npm run test:ui          # Run tests in interactive UI mode
npm run test:headed      # Run tests with visible browser
npm run test:debug       # Run tests in debug mode
npx playwright show-report  # View test report after running tests
```

### Database
```bash
npx prisma generate      # Generate Prisma client (runs on postinstall)
npx prisma migrate dev   # Run migrations in development
npx prisma studio        # Open Prisma Studio GUI
tsx run-migration.ts     # Run migrations using custom script
tsx list-tables.ts       # List all database tables
tsx check-user.ts        # Check user details
```

### Admin Management
```bash
npm run create-admin     # Interactive admin user creation script
tsx create-prod-admin.ts # Create admin user in production
```

### Calendar Updates
```bash
node scripts/update-calendar.js  # Fetch and update calendar from iCal feed
```

## Architecture Overview

### Tech Stack
- **Frontend**: SvelteKit 2.x with Svelte 5 (runes API)
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: Better Auth with email/password
- **Testing**: Playwright with MCP integration

### Database Schema (Prisma)

The application manages two main financial domains:

1. **Scout Accounts**: Individual scout financial accounts with transactions
   - `Scout`: Scout records with beginning balance, fiscal year
   - `Transaction`: Scout account transactions (Deposit, Withdrawal, Pack Dues Paid, Reimbursement, Transfer to Pack)
   - `PackDuesPayment`: Pack dues payment tracking (Cash, Check, Scout Account)

2. **Pack Finances**: Pack-level financial tracking
   - `PackTransaction`: Pack income and expenses with categories
   - `FiscalYearConfig`: Per-year configuration (pack dues amount)
   - Linked transactions: Scout transactions can link to pack transactions

3. **Authentication & Users**
   - `User`: User accounts with roles (ADMIN, TREASURER, USER)
   - `Session`, `Account`, `Verification`: Better Auth tables
   - `Invitation`: Email invitation system for user onboarding

### Directory Structure

```
src/
├── routes/                    # SvelteKit file-based routing
│   ├── +page.svelte          # Public home page
│   ├── +layout.svelte        # Root layout
│   ├── activities/           # Activity listings
│   ├── calendar/             # Event calendar (fetched from iCal)
│   ├── finances/             # Finance management app (auth required)
│   │   ├── ScoutFinanceApp.svelte  # Main finance dashboard (1000+ lines)
│   │   ├── api/              # API endpoints for CRUD operations
│   │   │   ├── scouts/
│   │   │   ├── transactions/
│   │   │   ├── pack-transactions/
│   │   │   ├── pack-dues-payments/
│   │   │   ├── fiscal-year-config/
│   │   │   ├── users/
│   │   │   └── invitations/
│   │   ├── components/       # Finance-specific components
│   │   ├── scouts/[id]/      # Individual scout detail pages
│   │   ├── users/            # User management pages
│   │   └── accept-invite/    # Invitation acceptance flow
│   └── [other-pages]/        # Public pages (FAQ, guides, etc.)
├── lib/
│   ├── auth.ts               # Better Auth client setup
│   ├── server/
│   │   ├── auth.ts           # Better Auth server config
│   │   ├── authorization.ts  # Role-based access helpers
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── validation.ts     # Zod schemas for validation
│   ├── services/
│   │   └── financeApi.ts     # Client-side API wrapper functions
│   ├── types/
│   │   └── finances.ts       # TypeScript types for finance domain
│   ├── components/           # Shared UI components
│   │   ├── Navigation.svelte
│   │   ├── Footer.svelte
│   │   └── calendar/, guide/
│   └── assets/               # Static images and icons
├── hooks.server.ts           # SvelteKit server hooks (auth middleware)
└── app.d.ts                  # Type definitions for locals (user, session)

prisma/
├── schema.prisma             # Database schema
└── migrations/               # Migration history

tests/
├── e2e/                      # End-to-end tests
├── pages/                    # Page object models
└── helpers/                  # Test utilities (auth, db seeding)

scripts/
├── create-admin.ts           # Interactive admin creation
├── create-admin-auto.ts      # Automated admin creation
└── update-calendar.js        # Calendar sync from iCal
```

### Authentication Flow

1. **Better Auth** handles authentication with session cookies
2. `hooks.server.ts` runs on every request:
   - Extracts session from request headers
   - Fetches full user record with role from database
   - Populates `event.locals.user` and `event.locals.session`
3. Protected routes check `locals.user` in `+page.server.ts` load functions
4. Authorization helpers in `src/lib/server/authorization.ts`:
   - `requireAuth()`: Ensures user is logged in
   - `requireRole()`: Checks specific role access
   - `requireWriteAccess()`: Ensures ADMIN or TREASURER role
   - `canWrite()`: Returns boolean for write permission
   - `isAdmin()`: Returns boolean for admin check

### Role-Based Access

- **ADMIN**: Full access to everything, including user management
- **TREASURER**: Can manage finances (scouts, transactions), but not users
- **USER**: Read-only access to finances

### API Route Pattern

API routes follow consistent patterns:
- `GET /finances/api/{resource}` - List/get resources with optional query params
- `POST /finances/api/{resource}` - Create new resource
- `PUT /finances/api/{resource}/{id}` - Update resource
- `DELETE /finances/api/{resource}/{id}` - Delete resource

All write operations require authentication and ADMIN or TREASURER role.

### Key Technical Details

1. **Fiscal Years**: Finance data is partitioned by fiscal year strings (e.g., "2024-2025")
2. **Scout Balances**: Calculated from beginning balance + transactions
3. **Pack Dues Tracking**: Separate table tracks payments with multiple payment methods
4. **Linked Transactions**: Scout "Transfer to Pack" transactions can link to pack income transactions
5. **Client-Side State**: Main finance app (`ScoutFinanceApp.svelte`) manages all state in a single component
6. **Validation**: Zod schemas in `src/lib/server/validation.ts` validate all inputs

## Environment Variables

Required environment variables (see `.env` file):
```
DATABASE_URL=              # PostgreSQL connection string (main)
DATABASE_URL_UNPOOLED=     # Direct connection (for migrations)
BETTER_AUTH_SECRET=        # Secret for Better Auth session encryption
BETTER_AUTH_URL=           # Base URL for auth (e.g., http://localhost:5173)
```

Test environment (`.env.test`):
```
TEST_DATABASE_URL=         # Separate database for tests
```

## Testing Strategy

### Playwright Tests
- Tests use separate test database configured in `.env.test`
- Database is reset before each test run (`tests/helpers/db.ts`)
- Authentication uses cookie injection (no login form interaction needed)
- Page object models in `tests/pages/` for maintainability
- Sequential execution (workers: 1) to prevent race conditions

### MCP Integration
The project includes Playwright MCP setup (`.mcp.json`) for interactive browser automation with Claude Code. See `PLAYWRIGHT_SETUP.md` for details.

## Common Development Tasks

### Adding a New Scout Finance Feature
1. Update Prisma schema if needed (`prisma/schema.prisma`)
2. Run migration: `npx prisma migrate dev --name <feature_name>`
3. Add types to `src/lib/types/finances.ts`
4. Create API route in `src/routes/finances/api/`
5. Add validation in `src/lib/server/validation.ts`
6. Add client API function in `src/lib/services/financeApi.ts`
7. Update UI components in `src/routes/finances/components/`
8. Add tests in `tests/e2e/`

### Modifying Authorization
- Edit `src/lib/server/authorization.ts` for new permission checks
- Role definitions in Prisma schema (`enum UserRole`)
- User role checked in API routes using `requireWriteAccess()` or `requireRole()`

### Calendar Updates
The calendar is fetched from an iCal feed and stored in `src/content/calendar.json`. Run `node scripts/update-calendar.js` to refresh.

## Important Notes

- The main finance dashboard (`ScoutFinanceApp.svelte`) is a large single-file component (1000+ lines)
- Uses Svelte 5 runes API (`$props`, `$state`, `$derived`, `$effect`)
- All database operations go through Prisma client singleton (`src/lib/server/prisma.ts`)
- Better Auth handles all authentication - no custom JWT or session management
- PostgreSQL database with connection pooling (Neon, Prisma Accelerate compatible)
- Tailwind CSS v4 uses `@import` syntax in CSS files instead of `tailwind.config.js`

## Migration Pattern

When running migrations, use the custom script which supports both pooled and direct connections:
```bash
tsx run-migration.ts
```

This handles the DATABASE_URL_UNPOOLED connection needed for migrations with Neon or connection poolers.
