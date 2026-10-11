#!/bin/sh
set -e

# Apply the Prisma schema to the SQLite database on startup.
# Idempotent — it creates the DB if missing and adds missing tables/columns.
npx prisma db push

exec "$@"
