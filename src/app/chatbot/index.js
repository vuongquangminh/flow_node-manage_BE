const { langChainBot, tavilySearchRealtime } = require("./langChainBot");


const chatBot = (io, socket) => {
  socket.on("user-send-chatbot", async (data) => {
    console.log("data: ", data);
    try {
      langChainBot({ content: data }).then((result) => {
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
  socket.on("user-send-ai-agent-realtime", async (data) => {
    console.log("data: ", data);
    try {
      tavilySearchRealtime({ content: data }).then((result) => {
        console.log("result: ", result);
        socket.emit("ai-agent-realtime-response", result);
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", {
        message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
      });
    }
  })
};

module.exports = { chatBot };
