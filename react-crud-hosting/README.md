# React CRUD - Quản lý người dùng

## Cấu trúc

- `index.html`: trang chính, nạp React 18 và ReactDOM 18 từ CDN.
- `js/app.js`: JavaScript trình duyệt đã biên dịch từ JSX; đây là file được `index.html` chạy.
- `js/app.jsx`: mã nguồn JSX để đọc và chỉnh sửa.
- `css/style.css`: giao diện responsive.

## Chạy thử

1. Giải nén toàn bộ thư mục, không tách riêng `index.html` khỏi các thư mục `js/` và `css/`.
2. Máy cần có Internet để tải React/ReactDOM từ CDN và gọi API `https://jsonplaceholder.typicode.com/users`.
3. Có thể nhấp đúp `index.html` để mở bằng trình duyệt hoặc mở thư mục bằng VS Code và dùng Live Server.
4. Nếu giao diện vẫn không hiện, nhấn F12 > Console và kiểm tra thông báo lỗi. Trang có dòng thông báo khởi động để tránh màn hình trắng khi script không chạy.

## Đưa lên host tĩnh / GitHub Pages

Giữ nguyên cấu trúc thư mục, đưa `index.html`, `css/` và `js/` lên repository. Bật GitHub Pages cho branch/thư mục chứa `index.html`.

`index.html` chạy `js/app.js` (JavaScript thuần đã biên dịch), vì vậy trình duyệt không cần tải file JSX ngoài qua Babel Standalone. `js/app.jsx` được giữ lại làm mã nguồn có JSX; khi chỉnh sửa file này, cần biên dịch lại thành `js/app.js` trước khi triển khai.

Đây là cấu hình bài thực hành dùng CDN, chưa phải cấu hình build tối ưu cho production.
