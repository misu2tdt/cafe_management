# Coffee_store-management

# Copy .env.example vào .env trong folder server

# cd server Chạy terminal
docker compose build

# Sau đó chạy này để tạo sql
docker compose run backend npx prisma migrate dev --name init 

# Tạo container
docker compose up -d

# Cuối cùng chạy seed để insert data vào db
docker compose exec backend npm run seed

# Check các data trong container
docker compose exec backend npx prisma studio

# Lưu ý nếu muốn reset data hết từ cái bảng db nên dùng
docker compose down -v