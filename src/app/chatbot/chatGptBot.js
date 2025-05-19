const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { model } = require("../utils");

let historyMessages = [];

const chatgpt = async ({ content }) => {
  // Tạo mảng messages: lịch sử + message mới
  const messages = [...historyMessages, new HumanMessage(content)];
  const response = await model.invoke(messages);

  // Cập nhật lại history
  historyMessages.push(
    new HumanMessage(content),
    new AIMessage(response.content)
  );

  return response.content;
};

module.exports = { chatgpt };
