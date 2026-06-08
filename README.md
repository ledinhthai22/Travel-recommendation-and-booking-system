# Hướng dẫn cài đặt và sử dụng Frontend

## Yêu cầu

* Node.js >= 18
* Yarn >= 1.22

Kiểm tra phiên bản:

```bash
node -v
yarn -v
```

## Cài đặt

### 1. Clone dự án

```bash
git clone <repository-url>
cd frontend
```

### 2. Cài đặt thư viện

```bash
yarn
```

## Cấu hình môi trường

Tạo file `.env` tại thư mục gốc của dự án:

```env
VITE_API_URL=https://localhost:7016/api
```

Trong đó:

* `VITE_API_URL`: Địa chỉ API Backend.

## Chạy dự án

Khởi động môi trường phát triển:

```bash
yarn dev
```

Sau khi chạy thành công, truy cập:

```text
http://localhost:5173
```

## Build Production

Tạo bản build:

```bash
yarn build
```

## Xem trước bản Build

```bash
yarn preview
```

## Công nghệ sử dụng

* ReactJS
* Vite
* React Router DOM
* Axios
* Tailwind CSS
* Lucide React
* React Hot Toast
* React Datatable
## Lưu ý

* Backend phải được khởi động trước khi chạy Frontend.
* Back thực hiện câu lệch: Update-Database
* Kiểm tra đúng giá trị `VITE_API_URL` trong file `.env`.
* Nếu Backend sử dụng HTTPS (ASP.NET Core), cần tin cậy SSL Certificate:

```bash
dotnet dev-certs https --trust
```
