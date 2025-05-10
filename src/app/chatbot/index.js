const { tavilySearchRealtime, chatgpt, chatTool } = require("./langChainBot");

const chatBot = (io, socket) => {
  socket.on("user-send-chatTool", async (data) => {
    try {
      chatTool({ content: data }).then((result) => {
        console.log("result: ", result);
        socket.emit("chatTool-response", result.join("/n"));
      });
    } catch (error) {
      console.error("Lỗi khi cập nhật message:", error);
      socket.emit("flow-update-error", {
        message: "Có lỗi xảy ra khi cập nhật dữ liệu flow",
      });
    }
  });
  socket.on("user-send-chatbot", async (data) => {
    console.log("data: ", data);
    try {
      chatgpt({ content: data }).then((result) => {
        console.log("result: ", result);
        socket.emit("chatbot-response", result);
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
  });
};

module.exports = { chatBot };
