# Allo Inventory Reservation System

## Tech Stack

- Next.js App Router
- TypeScript
- Prisma
- Supabase PostgreSQL

## Features

- Product listing
- Warehouse inventory tracking
- Stock reservations
- Reservation confirmation
- Reservation cancellation
- Reservation expiry support
- Live countdown timer

## API Endpoints

GET /api/products

GET /api/warehouses

POST /api/reservations

POST /api/reservations/:id/confirm

POST /api/reservations/:id/release

GET /api/reservations/:id

## Concurrency Handling

Reservations are created inside a Prisma transaction.

Inventory availability is checked before increasing reservedUnits.

If insufficient stock exists the API returns HTTP 409 Conflict.

## Expiry Mechanism

Reservations contain expiresAt.

Confirmation endpoint validates expiry before confirming.

Expired reservations return HTTP 410 Gone.

Production cleanup can be implemented using:
- Vercel Cron Job
- Background Worker
- Scheduled database task

## Running Locally

npm install

Create .env

DATABASE_URL=<supabase_connection_string>

npx prisma generate

npm run dev

## Future Improvements

- Automatic expiry cleanup
- Idempotency support
- Better UI styling
- Redis locking
- Real-time inventory updates