const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const Flow = require("./app/models/Flow");

const app = express();
const port = require("./app/config/index");

// Tạo server HTTP từ app
const server = http.createServer(app);

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
  // socket.on("change-flow", async (data) => {
  //   try {
  //     console.log('data: ',data)
  //     const query = await Flow.find({_id: data._id})
  //     // Giả sử bạn nhận data từ client, và data có _id và các trường khác cần cập nhật
  //     const updatedData = await Flow.findOneAndUpdate({ _id: data._id }, data, {
  //       new: true,
  //     });
  //     if (updatedData) {
  //       // Gửi lại dữ liệu đã được cập nhật đến tất cả các client khác qua socket
  //       socket.broadcast.emit("flow-updated", updatedData);

  //       // Thông báo thành công cho client gửi sự kiện
  //       socket.emit("flow-update-success", {
  //         data: updatedData,
  //         message: "Bạn đã cập nhật dữ liệu flow thành công",
  //       });
  //     } else {
  //       // Nếu không tìm thấy dữ liệu để cập nhật
  //       socket.emit("flow-update-error", { message: "Dữ liệu không tồn tại" });
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi cập nhật flow:", error);
  //     socket.emit("flow-update-error", {
  //       message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
  //     });
  //   }
  // });

  // socket.on("disconnect", () => {
  //   console.log("User disconnected", socket.id);
  // });
});

// Middleware cấu hình cho Express
app.use(cors());
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: false }));
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

// Bắt đầu server chung
server.listen(port.port, () => {
  console.log(`Server running at http://localhost:${port.port}`);
});
