const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { model } = require("../utils");


let historyMessages = []

const chatgpt = async ({ content, message, sessionId, config }) => {
  const response = await model.invoke(historyMessages, new AIMessage(response.content));
  historyMessages.push(new HumanMessage(content), )
  console.log("AI trả lời:", response.content);
  return response.content;
};

module.exports = {chatgpt}