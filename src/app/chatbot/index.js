const { aiAgent } = require("./agent");
const { chatCustomTool } = require("./chatCustomTool");
const { chatEmbeddingBot } = require("./chatEmbedding");
const { chatgpt } = require("./chatGptBot");
const { chatTavily } = require("./chatTavilyBot");

const chatBot = (io, socket) => {
  socket.on("user-send-chatTool", async (data) => {
    try {
      chatCustomTool({ content: data }).then((result) => {
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
    try {
      chatgpt({
        content: data.message,
      }).then((result) => {
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
      chatTavily({ content: data }).then((result) => {
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
  socket.on("user-send-chat-embedding", async (data) => {
    try {
      chatEmbeddingBot({ content: data }).then((result) => {
        console.log("result: ", result);
        socket.emit("chat-embedding-response", result);
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
