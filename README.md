# Chatbot Integration Platform

## Giới thiệu

Dự án này là một nền tảng tích hợp chatbot, hỗ trợ nhiều tính năng như trò chuyện thời gian thực, tìm kiếm thông tin, dự báo thời tiết, và quản lý tài khoản. Nền tảng sử dụng các công nghệ hiện đại như LangChain, OpenAI, Redis, và Socket.IO để cung cấp trải nghiệm tương tác thông minh và hiệu quả.

## Các tính năng chính

- **Chatbot AI**: Tích hợp OpenAI GPT-3.5 để hỗ trợ trò chuyện thông minh.
- **Chatbot Tìm kiếm**: Sử dụng Tavily Search để tìm kiếm và tóm tắt thông tin từ các nguồn dữ liệu.
- **Dự báo thời tiết**: Tích hợp API OpenWeather để cung cấp thông tin thời tiết chi tiết.
- **Quản lý tài khoản**: Hỗ trợ đăng ký, đăng nhập, và quản lý thông tin người dùng.
- **Lịch sử trò chuyện**: Lưu trữ và truy xuất lịch sử trò chuyện.
- **Tích hợp OAuth2**: Hỗ trợ đăng nhập qua Google và GitHub.
- **Gửi email tự động**: Sử dụng Nodemailer để gửi email thông báo.

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
