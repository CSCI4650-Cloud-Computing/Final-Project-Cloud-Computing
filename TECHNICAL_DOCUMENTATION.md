# Technical Documentation

## Project Overview

ClubHub is a university club system management web application built to manage student membership records, fee payments, exports, and officer handoff workflows.

The application is designed as a Next.js App Router project with Prisma for data access and MariaDB/MySQL persistence in deployment. It supports:

- Student member CRUD
- Search and filtering
- Membership status tracking
- Payment history and outstanding balance tracking
- CSV and JSON export
- Print-friendly use
- Email handoff links

## Technology Stack

- Frontend: Next.js, React, TypeScript, CSS Modules
- Backend: Next.js Server Components, Server Actions, Route Handlers
- ORM: Prisma 7
- Database: MariaDB / MySQL
- Runtime: Node.js

## Architecture

The project follows a single-app full-stack structure inside the Next.js `app` directory.

### Main layers

1. UI layer
   - Renders the dashboard and user interactions
   - Located mainly in `app/_components/`

2. Server action layer
   - Handles create, update, delete, and payment mutations
   - Located in `app/actions.ts`

3. Data access layer
   - Handles Prisma client setup and dashboard data shaping
   - Located in `lib/prisma.ts`, `lib/club-data.ts`, and `lib/club-utils.ts`

4. API/export layer
   - Handles CSV and JSON export responses
   - Located in `app/api/export/route.ts`

5. Database schema layer
   - Defines tables, enums, and relationships
   - Located in `prisma/schema.prisma`

## Folder Structure

```text
app/
  actions.ts
  api/
    export/
      route.ts
  _components/
    club-dashboard.tsx
    club-dashboard.module.css
  globals.css
  layout.tsx
  page.tsx

lib/
  club-data.ts
  club-utils.ts
  prisma.ts

prisma/
  schema.prisma

prisma.config.ts
README.md
TECHNICAL_DOCUMENTATION.md
RELEASE_NOTES.md
```

## Data Model

### StudentMember

Stores the main club member profile.

Key fields:

- `studentId`
- `firstName`
- `lastName`
- `preferredName`
- `email`
- `phone`
- `dateOfBirth`
- `gender`
- `major`
- `minor`
- `department`
- `college`
- `yearLevel`
- `graduationTerm`
- `enrollmentStatus`
- `addressLine1`
- `addressLine2`
- `city`
- `state`
- `postalCode`
- `emergencyContactName`
- `emergencyContactPhone`
- `guardianName`
- `guardianPhone`
- `membershipStatus`
- `annualFee`
- `notes`
- `photoUrl`

### Payment

Stores club membership fee payments linked to a student.

Key fields:

- `studentPk`
- `periodLabel`
- `amount`
- `paidAt`
- `method`
- `reference`
- `note`

### Relationship

- One `StudentMember` can have many `Payment` records.

## Membership Status Values

- `ACTIVE`
- `PENDING`
- `LAPSED`
- `ALUMNI`

## Payment Method Values

- `CASH`
- `CARD`
- `TRANSFER`
- `ONLINE`
- `CHECK`

## Request Flow

### Read flow

1. `app/page.tsx` loads dashboard data on the server.
2. `getDashboardData()` in `lib/club-data.ts` reads students and payments.
3. Data is serialized into UI-friendly objects.
4. `club-dashboard.tsx` renders the dashboard client-side.

### Mutation flow

1. User submits a form in the dashboard.
2. A Server Action in `app/actions.ts` receives `FormData`.
3. Prisma writes changes into SQLite.
4. `revalidatePath("/")` refreshes dashboard data.

### Export flow

1. User opens `/api/export`
2. Route handler fetches dashboard data
3. Response is returned as CSV by default or JSON if requested

## Important Files

### `app/page.tsx`

- Server-rendered entry page
- Loads dashboard data before rendering

### `app/_components/club-dashboard.tsx`

- Main dashboard UI
- Handles search, selection, layout, forms, and action triggers

### `app/actions.ts`

- Contains Server Actions for:
  - `createStudentMember`
  - `updateStudentMember`
  - `deleteStudentMember`
  - `recordPayment`

### `lib/club-data.ts`

- Seeds sample data when database is empty
- Reads and serializes dashboard data
- Generates CSV export content

### `lib/prisma.ts`

- Initializes Prisma client
- Uses Prisma's SQLite adapter configuration for Prisma 7

### `prisma/schema.prisma`

- Defines the database schema and relationships

## Local Setup

### Requirements

- Node.js
- npm

### Install

```bash
npm install
```

### Environment

Create `.env` from `.env.example`:

```bash
copy .env.example .env
```

### Database connection

Set `DATABASE_URL` in `.env`:

```env
DATABASE_URL="mysql://clubuser:your_password@127.0.0.1:3306/clubhub"
```

### Prisma client generation

```bash
npm run prisma:generate
```

### Start development server

```bash
npm run dev
```

## Build and Quality Checks

### Lint

```bash
npm run lint
```

### Production build

```bash
npm run build
```

## Notes About Prisma and MariaDB/MySQL

This project uses Prisma 7 with MariaDB/MySQL-ready configuration. The repository includes:

- `prisma/schema.prisma` for the data model
- `prisma.config.ts` for datasource configuration
- `lib/prisma.ts` for the Prisma client setup

In this environment, Prisma client generation works correctly and the project builds successfully.

## Current UX Structure

The dashboard is organized into three aligned work areas:

1. Left rail
   - Member roster list

2. Center workspace
   - Selected student details
   - Adviser notes
   - Payment history and payment entry

3. Right rail
   - Student record create/edit form

## Export Endpoints

### CSV export

```text
/api/export
```

### Single-student export

```text
/api/export?studentId=<id>
```

### JSON export

```text
/api/export?format=json
```

## Future Enhancements

- Authentication and role-based access
- AWS deployment with managed relational database
- Email sending through a real mail service
- Receipt PDF generation
- Audit trail for record changes
- Dashboard analytics and charts
- Bulk import from spreadsheet files

## Maintenance Guidance

- Keep Server Actions focused on mutation logic only
- Keep Prisma access centralized in `lib/`
- Preserve the 3-column dashboard layout unless the workflow changes
- Add tests before introducing high-risk shared features
