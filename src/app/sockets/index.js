const { Server } = require("socket.io");
const { chatSocket } = require("./chat");
const express = require("express");
const { chatBot } = require("../chatbot");
const app = express();

const socketConfig = (server) => {
  // Gắn io vào req để có thể emit từ các controller
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  const io = new Server(server, {
    cors: {
      origin: [
        "http://localhost:5173",
        "https://flow-node-manage-fe.vercel.app",
      ], // Cho phép frontend React truy cập

      methods: ["GET", "POST"],
    },
  });
  io.on("connection", (socket) => {
    // Gửi một node mẫu từ server khi client connect
    const user = socket.handshake.query.user;
    socket.user = JSON.parse(user); // gán vào socket

    chatSocket(io, socket);
    chatBot(io, socket);
  });
};

module.exports = { socketConfig };
