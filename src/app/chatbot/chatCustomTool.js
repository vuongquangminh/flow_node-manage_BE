const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const { model } = require("../utils");
const {
  advisoryNews,
  suggestProduct,
  selectProduct,
  selectPackage,
  inputCustomerInfo,
  submitOrder,
  priceProduct,
  weatherTool,
} = require("./tool.js");

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

  const tools = [
    advisoryNews,
    suggestProduct,
    selectProduct,
    selectPackage,
    inputCustomerInfo,
    submitOrder,
    priceProduct,
    weatherTool,
  ];

  const res = await model
    .bindTools(tools)
    .invoke([...historyMessages, new HumanMessage(content)], config);

  const toolsByName = {
    advisoryNews: advisoryNews,
    suggestProduct: suggestProduct,
    selectProduct: selectProduct,
    selectPackage: selectPackage,
    inputCustomerInfo: inputCustomerInfo,
    submitOrder: submitOrder,
    priceProduct: priceProduct,
    weatherTool: weatherTool,
  };
  const messages = [];

  // console.log("res: ", res);
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
  console.log("historyMessages: ", historyMessages);
  return messages;
};

module.exports = {
  chatCustomTool,
};
