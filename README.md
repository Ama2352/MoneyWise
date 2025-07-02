# MoneyWise Frontend

## Yêu cầu

- Node.js >= 18
- npm >= 9 (hoặc dùng yarn/pnpm nếu thích)
- Đã cài đặt backend (nếu cần kết nối API)

## Cài đặt

```bash
npm install
# hoặc
yarn install
# hoặc
pnpm install
```

## Thiết lập biến môi trường (.env)

Dự án sử dụng file `.env.local` để cấu hình các biến môi trường cho frontend.  
**Không commit file này lên GitHub.**  
Bạn hãy tạo file `.env.local` ở thư mục gốc dự án theo mẫu dưới đây:

```env
# .env.local
VITE_API_BASE_URL=http://localhost:8080/api
VITE_APP_NAME=MoneyWise
VITE_APP_VERSION=1.0.0
```

**Hướng dẫn:**
1. Copy file mẫu `.env.example` (nếu có) hoặc tạo mới file `.env.local` theo format trên.
2. Sửa giá trị các biến cho phù hợp với môi trường của bạn.

> **Lưu ý:**  
> - Không commit file `.env.local` lên GitHub (đã được thêm vào `.gitignore`).
> - Nếu deploy production, hãy cấu hình biến môi trường phù hợp với server.

---

## Chạy dự án (phát triển)

```bash
npm run dev
# hoặc
yarn dev
# hoặc
pnpm dev
```

Sau đó truy cập [http://localhost:5173](http://localhost:5173) trên trình duyệt.

## Build production

```bash
npm run build
# hoặc
yarn build
# hoặc
pnpm build
```

## Kiểm tra ESLint

```bash
npm run lint
# hoặc
yarn lint
# hoặc
pnpm lint
```

---

## Cấu trúc dự án

- `src/` - Mã nguồn chính của frontend
- `src/pages/` - Các trang chính (Dashboard, Transactions, Wallets, ...)
- `src/components/` - Các component dùng chung
- `src/hooks/` - Custom hooks
- `src/styles/` - File CSS

---

## Lưu ý

- Đảm bảo backend đã chạy và cấu hình đúng endpoint API nếu cần.
- Nếu gặp lỗi cổng hoặc lỗi mạng, kiểm tra lại file `.env` hoặc cấu hình proxy (nếu có).

---

## Liên hệ

Nếu gặp vấn đề, hãy tạo issue hoặc liên hệ nhóm phát triển.
