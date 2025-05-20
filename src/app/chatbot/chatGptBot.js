const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { model } = require("../utils");
const { getRedis } = require("../redis");

let historyMessages = [];

const chatgpt = async ({ content }) => {
  // Tạo mảng messages: lịch sử + message mới

  const getCache = await getRedis(content);
  if (getCache) {
    return getCache;
  } else {
    const messages = [...historyMessages, new HumanMessage(content)];
    const response = await model.invoke(messages);

    // Cập nhật lại history
    historyMessages.push(
      new HumanMessage(content),
      new AIMessage(response.content)
    );

    return response.content;
  }
};

module.exports = { chatgpt };
