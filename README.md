# Coffee Store Management

A coffee shop management system built with Node.js, Prisma, and Docker.

## How to Run Using Docker

```bash
# Step 1: Copy environment configuration file
cp server/.env.example server/.env

# Step 2: Navigate to the server directory
cd server

# Step 3: Build Docker container
docker compose build

# Step 4: Create database schema using Prisma
docker compose run backend npx prisma migrate dev --name init

# Step 5: Start the container
docker compose up -d

# Step 6: Run seed script to insert sample data
docker compose exec backend npm run seed

# Step 7: Open Prisma Studio to check database
docker compose exec backend npx prisma studio

# To reset the database completely (delete volume)
docker compose down -v
