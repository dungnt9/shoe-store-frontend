# Shoe Store Frontend

Frontend cho ứng dụng quản lý cửa hàng giày, được xây dựng với Nuxt 3, TypeScript và SCSS.

## Công nghệ sử dụng

- Nuxt 3: Framework Vue.js cho phát triển ứng dụng Universal
- Vue 3: Framework JavaScript cho xây dựng giao diện người dùng
- TypeScript: Ngôn ngữ lập trình mở rộng của JavaScript
- Pinia: Thư viện quản lý trạng thái (state management)
- SCSS: CSS preprocessor cho styling
- Fetch API: Giao tiếp với backend

## Cài đặt

1. Clone dự án và cài đặt dependencies:

```bash
# Clone dự án
git clone <url_repository>

# Cài đặt dependencies
cd shoe-store-frontend
npm install
```

2. Cấu hình kết nối với backend:

Kiểm tra cấu hình trong file `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  // ...
  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE || 'http://localhost:3001'
    }
  }
})
```

3. Chạy ứng dụng:

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Web sẽ chạy tại: http://localhost:3000


## Tính năng

- Hiển thị danh sách giày
- Xem chi tiết từng đôi giày
- Thêm giày mới
- Cập nhật thông tin giày
- Xóa giày
