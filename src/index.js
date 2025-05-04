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
const Friend = require("./app/models/Friend");

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
  const user = socket.handshake.query.user;
  socket.user = JSON.parse(user); // gán vào socket

  socket.on("sent-message", async (data) => {
    try {
      const createMessage = await Chat.create({
        name_sent: data.name_sent,
        sender_id: data.sender_id,
        receiver_id: data.receiver_id,
        name_receiver: data.name_receiver,
        message: data.message,
      });

      io.emit("conversation-updated", createMessage);
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", {
        message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
      });
    }
  });

  socket.on("add-friend", async (data) => {
    const query = await Friend.findOne({
      $or: [
        {
          id_user_1: socket.user._id,
          id_user_2: data.id,
        },
        {
          id_user_1: data.id,
          id_user_2: socket.user._id,
        },
      ],
    });
    if (query) {
      return;
    }

    const checkExit = await Account.findOne({
      _id: data.id,
    });
    if (checkExit) {
      const new_record = await Friend.create({
        id_user_1: socket.user._id,
        email_user_1: socket.user.email,
        name_user_1: socket.user.name,
        id_user_2: checkExit._id,
        email_user_2: checkExit.email,
        name_user_2: checkExit.name,
      });
      io.emit("update-friend", new_record);
    } else {
      return;
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
