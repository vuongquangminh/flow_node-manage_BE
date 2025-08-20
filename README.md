# Chatbot Integration Platform

## Giới thiệu

Dự án này là một sản phẩm bán hàng có tích hợp chatbot, hỗ trợ nhiều tính năng như trò chuyện thời gian thực, tìm kiếm thông tin, quản lý sản phẩm, quản lý đơn hàng và quản lý tài khoản. Nền tảng sử dụng các công nghệ hiện đại như LangChain, OpenAI, Redis, và Socket.IO để cung cấp trải nghiệm tương tác thông minh và hiệu quả.

## Các tính năng chính

- **Login, Logout, Register, OAuth2**: AAuthorization 
- **CRUD account**: Admin quản lý tài khoản người dùng
- **CRUD product**: Admin quản lý sản phẩm đưa lên thị trường.
- **CRUD đơn hàng**: User có thể quản lý giỏ hàng của mình khi đã đăng nhập.
- **Landing page giới thiệu sản phẩm**: Trang hiển thị giao diện chào mời khách hàng và sản phẩm nổi bật cùng những thông tin của sản phẩm.
- **Chi tiết sản phẩm**: Xem chi tiết thông số chọn size màu sắc cho sản phẩm.
- **Gửi email tự động**: Gửi mail tự động khi người dùng đã đăng nhập và đặt hàng..
- **Chatbot AI**: Tích hợp OpenAI GPT-3.5 để hỗ trợ trò chuyện thông minh.

## Công nghệ sử dụng

- **Node.js**: Nền tảng chính để xây dựng ứng dụng.
- **Express.js**: Framework để xây dựng API.
- **Socket.IO**: Hỗ trợ giao tiếp thời gian thực.
- **LangChain**: Tích hợp các mô hình AI và công cụ thông minh.
- **Redis**: Lưu trữ tạm thời và cache dữ liệu.
- **MongoDB**: Cơ sở dữ liệu NoSQL để lưu trữ thông tin người dùng và lịch sử trò chuyện.
- **OpenAI**: Sử dụng GPT-3.5 để xử lý ngôn ngữ tự nhiên.
- **Nodemailer**: Gửi email tự động.

## Cách chạy dự án

1. Cài đặt các phụ thuộc:
   ```sh
   npm install
   ```
2. Chạy dự án:
   npm run dev
