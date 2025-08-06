const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { model } = require("../utils");
const { getRedis } = require("../redis");

let historyMessages = [];

const chatgpt = async ({ content, onToken }) => {
  // Tạo mảng messages: lịch sử + message mới

  const messages = [...historyMessages, new HumanMessage(content)];
  const stream = await model.stream(messages);

  let fullText = "";

  for await (const chunk of stream) {
    const token = chunk.content || ""; // phòng ngừa undefined
    fullText += token;

    // Gửi token về client (qua WebSocket, SSE, hoặc gọi hàm callback)
    if (onToken) onToken(token);
  }
  // Cập nhật lại history
  historyMessages.push(new HumanMessage(content), new AIMessage(fullText));

  // }
};

module.exports = { chatgpt };
