# Release Notes

## Version 1.0.0

Release date: April 26, 2026

### Summary

Initial release of ClubHub, a university club system management application for student membership tracking, payment monitoring, exports, and record administration.

### New Features

- Added full student member CRUD workflow
- Added searchable student roster
- Added membership status filtering
- Added detailed student profile view
- Added student photo support through stored image URLs
- Added annual fee and payment history tracking
- Added outstanding balance calculation
- Added payment recording workflow
- Added CSV export endpoint
- Added JSON export endpoint
- Added print support through browser printing
- Added email handoff links for member summaries
- Added realistic seeded starter data for demo and testing

### UI and UX

- Replaced the default starter page with a custom ClubHub dashboard
- Introduced a modern aligned three-rail dashboard layout
- Reduced oversized hero presentation styling in favor of a more realistic admin interface
- Standardized spacing, card sizing, and control alignment
- Improved mobile and responsive layout behavior

### Technical Changes

- Added Prisma 7 integration
- Added MariaDB/MySQL-ready persistence configuration
- Added Prisma schema for `StudentMember` and `Payment`
- Added Server Actions for create, update, delete, and payment recording
- Added route handler for export operations
- Added Prisma config for datasource setup
- Added utility helpers for currency formatting and email summaries

### Verification

The following checks passed for this release:

- `npm run lint`
- `npm run build`

### Known Notes

- The app is configured for local SQLite use in the current project setup.
- AWS deployment can be added later by switching Prisma to a managed cloud database.
- Email handoff currently uses `mailto:` links rather than a direct outbound mail service.

### Files Added or Updated in This Release

- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/actions.ts`
- `app/api/export/route.ts`
- `app/_components/club-dashboard.tsx`
- `app/_components/club-dashboard.module.css`
- `lib/prisma.ts`
- `lib/club-data.ts`
- `lib/club-utils.ts`
- `prisma/schema.prisma`
- `prisma.config.ts`
- `README.md`
- `TECHNICAL_DOCUMENTATION.md`
- `RELEASE_NOTES.md`
