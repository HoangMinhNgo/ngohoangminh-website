# React CRUD - Quản lý người dùng

## Cấu trúc

- `index.html`: trang HTML nạp React 18, ReactDOM 18 và Babel từ CDN.
- `js/app.jsx`: các component `App`, `SearchForm`, `AddUser`, `ResultTable` và logic CRUD.
- `css/style.css`: giao diện responsive.

## Chạy thử

Có thể mở `index.html` bằng Live Server trong VS Code. Vì ứng dụng gọi API `https://jsonplaceholder.typicode.com/users`, máy cần có kết nối Internet.

## Đưa lên host tĩnh / GitHub Pages

Giữ nguyên cấu trúc thư mục, đưa `index.html`, `css/` và `js/` lên cùng một thư mục trong repository. Bật GitHub Pages cho branch/thư mục chứa `index.html`.

Ứng dụng dùng thư viện React từ CDN và không cần bước build. `Babel Standalone` chuyển JSX trong `js/app.jsx` ngay trên trình duyệt; đây là cách phù hợp cho bài thực hành/học tập, không phải cấu hình tối ưu cho website production.
