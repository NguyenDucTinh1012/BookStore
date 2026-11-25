# BookStore Frontend

Frontend quản lý nhà sách và cửa hàng dành cho khách hàng, xây dựng bằng React, Vite và React Router.

## Chạy ứng dụng

Yêu cầu Node.js và backend BookStore API đang chạy tại `https://localhost:7035`.

```bash
npm install
npm run dev
```

Mở URL Vite in trong terminal, thường là `http://localhost:5173`. Vite chuyển tiếp các request `/api` tới backend `https://localhost:7035` (đã cấu hình trong `vite.config.js`). Hãy chạy backend trước để tải sách, danh mục và thao tác đơn hàng.

Các lệnh khác:

```bash
npm run lint
npm run build
npm run preview
```

## Tài khoản admin demo

Đăng nhập tại `/login` với thông tin:

| Trường | Giá trị |
| --- | --- |
| Email | `admin@bookstore.local` |
| Mật khẩu | `Admin123!` |

Sau khi đăng nhập, ứng dụng chuyển tới `/admin`. Tài khoản demo được tạo và lưu trong `localStorage` ở lần đăng nhập đầu tiên. Nếu cần thử lại luồng khởi tạo tài khoản, xóa dữ liệu trang web của frontend trong trình duyệt rồi đăng nhập lại bằng thông tin trên.

Bạn cũng có thể tạo tài khoản khách hàng tại `/register`. Form đăng ký có lựa chọn vai trò admin để tiện xem thử giao diện; các tài khoản demo và vai trò được lưu cục bộ trên trình duyệt, không ghi vào cơ sở dữ liệu.

> **Lưu ý:** Đây chỉ là đăng nhập demo phía frontend. Không dùng thông tin này cho môi trường thật; kiểm tra vai trò ở trình duyệt không bảo vệ API/backend.

## Các khu vực giao diện

- Cửa hàng: trang chủ, danh mục, sách theo danh mục, chi tiết sách, giỏ hàng và đặt mua.
- Đơn hàng khách hàng: danh sách và chi tiết đơn hàng.
- Quản trị: danh mục, sách, đơn hàng, chi tiết đơn hàng và báo cáo.
- Giỏ hàng được giữ trong `localStorage`. Dữ liệu sách, danh mục và đơn hàng được lấy từ API backend.

## Cấu trúc mã nguồn

```text
src/
├── app/                 # Khởi tạo ứng dụng, route và route guard
├── components/          # Thành phần dùng chung và layout
├── features/
│   ├── auth/            # Đăng nhập, đăng ký demo, phiên đăng nhập cục bộ
│   ├── books/           # API và giao diện sách quản trị
│   ├── cart/            # Giỏ hàng và checkout
│   ├── categories/      # API và giao diện danh mục quản trị
│   ├── customerOrders/  # Lịch sử và chi tiết đơn phía khách hàng
│   ├── orderDetails/    # Giao diện chi tiết đơn quản trị
│   ├── orders/          # API và giao diện đơn quản trị
│   ├── reports/         # Báo cáo quản trị
│   └── storefront/      # Trang chủ, danh mục và chi tiết sách
├── shared/              # API client và hàm tiện ích dùng chung
└── styles/              # CSS cho cửa hàng và quản trị
```

## Ghi chú về API đơn hàng

Frontend gửi thông tin người nhận và danh sách `BookId`/`Quantity` tới API. Backend hiện dùng `TEST_USER_ID` khi tạo đơn và tải `my-orders`, nên tài khoản demo chưa có lịch sử đơn riêng theo từng email. Backend cũng cần được bổ sung xác thực và phân quyền thật trước khi đưa ứng dụng lên môi trường công khai.
