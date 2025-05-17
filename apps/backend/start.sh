#!/bin/sh

# Wait for databases to be ready (if needed)
echo "Waiting for databases to be ready..."
sleep 5

# Run migrations if needed
echo "Running migrations..."
npx prisma db pull --schema prisma/opher.prisma && npx prisma generate --schema prisma/opher.prisma
npx prisma db push 

# Start the application
echo "Starting the application..."
node dist/server.js 