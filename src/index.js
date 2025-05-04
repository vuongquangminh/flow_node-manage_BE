const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const port = require("./app/config/index");
const Account = require("./app/models/Account");
const Chat = require("./app/models/Chat");

// Tạo server HTTP từ app
const server = http.createServer(app);

// Middleware cấu hình cho Express
app.use(cors());
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Gắn io vào req để có thể emit từ các controller
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Kết nối DB và khai báo routes
const db = require("./app/config/db");
const routeApp = require("./app/routes");

db.connect();
routeApp(app);

// Khởi tạo socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Cho phép frontend React truy cập
    methods: ["GET", "POST"],
  },
});

// Khi client kết nối socket
io.on("connection", (socket) => {
  // Gửi một node mẫu từ server khi client connect
  socket.on("sent-message", async (data) => {
    try {
      console.log("data: ", data);

      const createMessage = await Chat.create({
        name_sent: data.name_sent,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        name_receiver: data.name_receiver,
        message: data.message,
      });

      console.log("createMessage: ", createMessage);
      io.emit("conversation-updated", createMessage);
      console.log("Sent conversation-updated to clients");
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", {
        message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
      });
    }
  });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected", socket.id);
  // });
});

// Bắt đầu server chung
server.listen(port.port, () => {
  console.log(`Server running at http://localhost:${port.port}`);
});
