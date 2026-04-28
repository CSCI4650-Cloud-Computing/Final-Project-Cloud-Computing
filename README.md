# ClubHub

ClubHub is a university club system management app built with Next.js App Router, Prisma, and MariaDB/MySQL. It provides:

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
- MariaDB / MySQL
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

3. Create a local environment file:

```bash
copy .env.example .env
```

4. Update `DATABASE_URL` inside `.env` with your MariaDB/MySQL connection string:

```env
DATABASE_URL="mysql://clubuser:your_password@127.0.0.1:3306/clubhub"
```

5. Generate the Prisma client and apply the schema:

```bash
npx prisma generate
npx prisma migrate deploy
```

Prisma 7 reads the datasource URL from [prisma.config.ts](/D:/@risFolio/Education/UNO/Fall%202026/26SP%20CSCI4650-850Intro%20To%20Cloud%20Computing/Assignments/Group%20Project/finalproject/prisma.config.ts). The runtime client is configured in [lib/prisma.ts](/D:/@risFolio/Education/UNO/Fall%202026/26SP%20CSCI4650-850Intro%20To%20Cloud%20Computing/Assignments/Group%20Project/finalproject/lib/prisma.ts).

6. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Notes

- The app auto-seeds a realistic sample club roster the first time the database is empty.
- Export all members with `/api/export`.
- Export a single student with `/api/export?studentId=<id>`.
- Retrieve JSON instead of CSV with `/api/export?format=json`.

## EC2 deployment notes

This project is now prepared for MariaDB/MySQL deployment on EC2.

Typical EC2 setup:

```bash
sudo dnf update -y
sudo dnf install -y git nginx nodejs20 mariadb105
```

If MariaDB runs on the same EC2 instance, also install:

```bash
sudo dnf install -y mariadb105-server
sudo systemctl enable --now mariadb
sudo mysql_secure_installation
```

Application deployment flow:

```bash
npm install
npm run prisma:generate
npx prisma migrate deploy
npm run build
npm run start
```

For production, place Nginx in front of `next start` and keep your real `DATABASE_URL` only on the server.
