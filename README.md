# Coffee Store Management

Hệ thống quản lý cửa hàng cà phê được xây dựng với Node.js, Prisma và Docker.

## Hướng dẫn chạy bằng Docker

```bash
# Bước 1: Sao chép file môi trường
cp server/.env.example server/.env

# Bước 2: Di chuyển vào thư mục server
cd server

# Bước 3: Build Docker container
docker compose build

# Bước 4: Tạo cơ sở dữ liệu bằng Prisma
docker compose run backend npx prisma migrate dev --name init

# Bước 5: Khởi động container
docker compose up -d

# Bước 6: Chạy seed để insert dữ liệu mẫu
docker compose exec backend npm run seed

# Bước 7: Mở Prisma Studio để kiểm tra dữ liệu
docker compose exec backend npx prisma studio

# Nếu muốn reset toàn bộ database (xóa volume)
docker compose down -v
