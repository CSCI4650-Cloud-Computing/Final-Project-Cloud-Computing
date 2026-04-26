# ClubHub

ClubHub is a university club system management app built with Next.js App Router, Prisma, and SQLite. It provides:

- Student membership CRUD
- Search and status filtering
- Payment and dues tracking
- Student profile photos
- CSV and JSON export
- Print-friendly output
- Email handoff via `mailto:` summaries

## Stack

- Next.js 16 App Router
- React 19
- Prisma ORM
- SQLite
- Tailwind CSS 4 for base tooling, with custom CSS modules for the interface

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create a local environment file:

```bash
copy .env.example .env
```

3. Generate the Prisma client and create the SQLite database:

```bash
npx prisma generate
npx prisma db push
```

Prisma 7 reads the datasource URL from [prisma.config.ts](/D:/@risFolio/Education/UNO/Fall%202026/26SP%20CSCI4650-850Intro%20To%20Cloud%20Computing/Assignments/Group%20Project/finalproject/prisma.config.ts) and uses the SQLite driver adapter configured in [lib/prisma.ts](/D:/@risFolio/Education/UNO/Fall%202026/26SP%20CSCI4650-850Intro%20To%20Cloud%20Computing/Assignments/Group%20Project/finalproject/lib/prisma.ts).

4. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The app auto-seeds a realistic sample club roster the first time the database is empty.
- Export all members with `/api/export`.
- Export a single student with `/api/export?studentId=<id>`.
- Retrieve JSON instead of CSV with `/api/export?format=json`.

## AWS direction

This project is currently configured with SQLite for local and classroom use. For AWS deployment later, the Next.js app structure and Prisma usage can be kept while changing the Prisma datasource to a managed database such as Amazon RDS.
