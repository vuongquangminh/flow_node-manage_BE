const { Server } = require("socket.io");
const { chatSocket } = require("./chat");
const express = require("express");
const { chatBot } = require("../chatbot");
const app = express();
const cron = require("node-cron");
const { chatCustomTool } = require("../chatbot/chatCustomTool");

const socketConfig = (server) => {
  // Gắn io vào req để có thể emit từ các controller
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173", // Cho phép frontend React truy cập
      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    // Gửi một node mẫu từ server khi client connect
    const user = socket.handshake.query.user;
    socket.user = JSON.parse(user); // gán vào socket

    chatSocket(io, socket);
    chatBot(io, socket);
    // Lấy mỗi ngày lúc 7 giờ sáng
    cron.schedule("* * * * *", async () => {
      console.log("📅 Bắt đầu lấy dữ liệu thời tiết lúc 7h sáng...");

      chatCustomTool({ content: "Thời tiết ở Lao Cai" }).then((result) => {
        console.log("result: ", result);
        socket.emit("chatTool-response", result.join("/n"));
      });
    });
    // socket.on("disconnect", () => {
    //   console.log("User disconnected", socket.id);
    // });
  });
};

module.exports = { socketConfig };
