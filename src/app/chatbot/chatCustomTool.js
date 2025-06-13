const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { model } = require("../utils");
const { weatherTool, commandMe } = require("./tool.js");

// Tạo context chia sẻ giữa các tool
const context = {
  selectedProduct: null,
};

let historyMessages = [];

const chatCustomTool = async ({ content }) => {
  const config = {
    configurable: {
      context: {
        selectedProduct: context.selectedProduct,
      },
    },
  };

  const tools = [weatherTool, commandMe];

  const res = await model
    .bindTools(tools)
    .invoke([...historyMessages, new HumanMessage(content)], config);

  const toolsByName = {
    weatherTool: weatherTool,
    commandMe: commandMe,
  };
  const messages = [];

  if (!res.tool_calls || res.tool_calls.length === 0) {
    // Không có tool nào được gọi, trả về từ ChatGPT trực tiếp
    // const fallbackRes = await model.invoke([new HumanMessage(content)]);
    // return [fallbackRes.text];
    return [
      "Xin lỗi, tôi chưa hiểu bạn muốn hỏi gì. Bạn có thể chọn dịch vụ để tôi hỗ trợ nhé!",
    ];
  }
  for (const toolCall of res.tool_calls) {
    const selectedTool = toolsByName[toolCall.name];
    const toolMessage = await selectedTool.invoke(toolCall.args, config);

    historyMessages.push(new HumanMessage(content), new AIMessage(toolMessage));
    messages.push(toolMessage);
  }
  return messages;
};

module.exports = {
  chatCustomTool,
};
