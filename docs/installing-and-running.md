# Cài đặt và Khởi chạy (Installing & Running)

Tài liệu hướng dẫn các bước thiết lập dự án nhanh gọn nhất dành cho lập trình viên khi lần đầu clone repository về máy.

---

## 1. Yêu cầu môi trường (Prerequisites)

- **Node.js**: >= 20.x (khuyến nghị dùng Node.js LTS theo `.nvmrc`)
- **npm**: >= 10.x
- **Docker & Docker Compose**: Để chạy MongoDB, Mongo-Express và Maildev.

---

## 2. Các bước cài đặt (Quick Setup)

### Bước 1: Clone repository & Cài đặt dependencies

```bash
git clone https://github.com/Han3107/score-up-toeic-be.git
cd score-up-toeic-be
npm install
```

### Bước 2: Thiết lập biến môi trường (.env)

Copy file cấu hình mẫu dành cho MongoDB:

```bash
cp env-example-document .env
```

> [!IMPORTANT]
> **Khi chạy ứng dụng trực tiếp trên máy (Local Dev với `npm run start:dev`):**  
> Mở file `.env` và kiểm tra đảm bảo `DATABASE_URL` trỏ về `localhost`:
>
> ```env
> DATABASE_URL=mongodb://localhost:27017
> ```
>
> _(Chỉ dùng `DATABASE_URL=mongodb://mongo:27017` khi chạy cả ứng dụng NestJS bên trong container Docker)_.

### Bước 3: Khởi động Database & Dịch vụ phụ trợ

Khởi chạy container MongoDB, Mongo-Express (Web GUI) và Maildev:

```bash
docker compose -f docker-compose.document.yaml up -d mongo mongo-express maildev
```

Kiểm tra trạng thái container:

```bash
docker ps
```

### Bước 4: Khởi tạo dữ liệu mẫu (Seed Data)

Chạy script seed để tạo dữ liệu mặc định (tài khoản Admin, User mẫu, Roles, Statuses):

```bash
npm run seed:run:document
```

### Bước 5: Khởi chạy ứng dụng (Development Mode)

```bash
npm run start:dev
```

---

## 3. Các đường dẫn dịch vụ (Useful Links)

| Dịch vụ                     | URL                          | Thông tin đăng nhập mặc định          |
| :-------------------------- | :--------------------------- | :------------------------------------ |
| **Backend API**             | <http://localhost:3001>      | -                                     |
| **Swagger Docs**            | <http://localhost:3001/docs> | -                                     |
| **Mongo-Express (Web GUI)** | <http://localhost:8081>      | Username: `root` / Password: `secret` |
| **Maildev (Test Email)**    | <http://localhost:1080>      | -                                     |

---

## 4. Kết nối Database bằng MongoDB Compass

Để kết nối và quản lý dữ liệu trực quan bằng **MongoDB Compass**:

### Cách 1: Dùng Connection String (Nhanh nhất)

Dán chuỗi URL sau vào ô **URI / New Connection** trong Compass rồi nhấn **Connect**:

```text
mongodb://root:secret@localhost:27017/?authSource=admin
```

### Cách 2: Điền thủ công (Advanced Connection Options)

- **Host**: `localhost` (hoặc `127.0.0.1`)
- **Port**: `27017`
- **Authentication**: Chọn `Username / Password`
  - **Username**: `root`
  - **Password**: `secret`
  - **Authentication Database**: `admin` _(Bắt buộc điền mục này để xác thực tài khoản root)_

---

## 5. Tài khoản mặc định sau khi Seed

- **Super Admin**:
  - Email: `admin@example.com`
  - Password: `secret`
- **User mẫu**:
  - Email: `john.doe@example.com`
  - Password: `secret`

---

## 6. Chạy toàn bộ hệ thống bằng Docker (Tùy chọn)

Nếu bạn muốn chạy toàn bộ ứng dụng (bao gồm cả NestJS backend) bằng Docker:

```bash
# 1. Chuẩn bị file .env (giữ nguyên DATABASE_URL=mongodb://mongo:27017)
cp env-example-document .env

# 2. Build và khởi chạy tất cả services
docker compose -f docker-compose.document.yaml up -d --build

# 3. Chạy seed dữ liệu bên trong container
docker compose -f docker-compose.document.yaml exec api npm run seed:run:document

# 4. Xem logs của ứng dụng
docker compose -f docker-compose.document.yaml logs -f api
```
