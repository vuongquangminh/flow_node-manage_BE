const { completion } = require("../helpers/chatbot");

const chatBot = (io, socket) => {
  socket.on("user-send-chatbot", async (data) => {
    console.log("data: ", data);
    try {
      completion({ content: data }).then((result) => {
        console.log("result: ", result);
        socket.emit("ai-response", result);
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", {
        message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
      });
    }
  });
};

module.exports = { chatBot };
