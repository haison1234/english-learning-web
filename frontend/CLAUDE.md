# WMS Frontend - AI Agent Guidelines

Thư mục này chứa mã nguồn Frontend cho hệ thống WMS, sử dụng React 18 + JavaScript + Tailwind CSS.

## Tech Stack
- **Library**: React 18
- **Styling**: Tailwind CSS & Vanilla CSS
- **State Management**: Zustand hoặc Redux
- **API Client**: Axios for HTTP calls
- **Routing**: React Router DOM

## Commands cơ bản
- **Cài đặt dependencies**: `npm install`
- **Chạy development server**: `npm run dev`
- **Build production**: `npm run build`
- **Kiểm tra lỗi (Lint)**: `npm run lint`

## Cấu trúc thư mục (`src/`)
Mã nguồn nằm trong thư mục `src/` và được tổ chức như sau:
- `components/`: React Components.
  - `common/`: Các Shared UI components dùng chung (Button, Table, Modal, Input, Spinner...).
  - `warehouse/`: Components phục vụ riêng cho nghiệp vụ kho (Receipt, Issue, Transfer...).
- `hooks/`: Các custom React Hooks (useFetch, useFilters, useAuth...).
- `pages/`: Các Page-level components tương ứng với từng Routes.
- `services/`: API client logic (Axios instances, interceptors, API requests).
- `stores/`: Quản lý state toàn cục (Zustand/Redux).
- `types/`: File định nghĩa kiểu dữ liệu (nếu dùng TypeScript hoặc JSDoc type).
- `utils/`: Các hàm helper tiện ích (formatQuantity, formatDate, validation...).

## Nguyên tắc viết Code
1. **Component Design**: Viết component dạng Functional Component với React Hooks. Giữ các UI component dùng chung (`common/`) tinh khiết (pure), không chứa business logic hay gọi API trực tiếp.
2. **Styling**: Ưu tiên sử dụng Tailwind CSS cho tốc độ phát triển nhanh và CSS nhất quán. Các hiệu ứng nâng cao hoặc style phức tạp có thể viết Vanilla CSS trong file CSS riêng.
3. **State Management**: Sử dụng `useState` cho local state. Với state dùng chung toàn hệ thống (Auth session, User profile, Settings), sử dụng Zustand hoặc Redux.
4. **API Integration**: Tất cả API calls đều phải tập trung tại thư mục `services/`. Sử dụng Axios interceptors để tự động chèn JWT token vào headers và xử lý lỗi global (như 401, 403, 500).
