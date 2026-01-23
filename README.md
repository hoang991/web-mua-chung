# Alo Mua Chung

Mã nguồn website Alo Mua Chung - Nền tảng mua chung tử tế.

## Yêu cầu hệ thống

- Node.js (phiên bản 16 trở lên)
- NPM hoặc Yarn

## Cài đặt và Chạy thử (Local)

1. Tải mã nguồn về máy.
2. Mở terminal tại thư mục dự án.
3. Cài đặt các thư viện:
   ```bash
   npm install
   ```
4. Chạy chế độ phát triển:
   ```bash
   npm run dev
   ```
   Truy cập `http://localhost:5173` để xem website.

## Đẩy lên GitHub

1. Tạo một repository mới trên GitHub.
2. Tại thư mục dự án, chạy các lệnh sau:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <LINK_REPOSITORY_CUA_BAN>
   git push -u origin main
   ```

## Triển khai lên Netlify (Tự động)

1. Đăng nhập Netlify.
2. Chọn "Add new site" -> "Import from an existing project".
3. Chọn GitHub và chọn repository bạn vừa tạo.
4. Tại phần **Build settings**:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Bấm "Deploy site".

## Cấu hình Supabase

Đảm bảo bạn đã cập nhật `services/supabase.ts` với URL và Key của dự án Supabase của bạn.
Chạy file SQL trong `SUPABASE_SETUP.sql` tại dashboard Supabase để tạo bảng dữ liệu.
