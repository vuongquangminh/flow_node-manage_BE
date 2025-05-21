const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const { model } = require("../utils");

// Tạo context chia sẻ giữa các tool
const context = {
  selectedProduct: null,
};

let historyMessages = [];

const chatCustomTool = async ({ content }) => {
  const selectProductSchema = z.object({
    product: z.string(),
  });
  const priceProductSchema = z.object({
    product: z.string().optional(), // có thể là undefined nếu dùng context
  });

  const advisoryNews = tool(
    async () => {
      return `Bạn muốn được tư vấn về dịch vụ gì?`;
    },
    {
      name: "advisoryNews",
      description: "Người dùng muốn hỏi về các vấn đề tư vấn.",
    }
  );

  const config = {
    configurable: {
      context: {
        selectedProduct: context.selectedProduct,
      },
    },
  };
  const selectProduct = tool(
    async (input) => {
      context.selectedProduct = input.product;
      return `Bạn vừa chọn dịch vụ ${input.product}`;
    },
    {
      name: "selectProduct",
      description:
        "Dùng khi người dùng nêu rõ tên dịch vụ họ muốn hỏi (ví dụ: 'Callbot', 'Chatbot')",
      schema: selectProductSchema,
    }
  );
  const priceProduct = tool(
    async (input, runContext) => {
      const product =
        input.product || runContext?.configurable?.context?.selectedProduct;

      if (!product) {
        return "Bạn chưa chọn dịch vụ nào để tôi báo giá.";
      }
      return `Giá của dịch vụ ${product} là ... (ví dụ: 500.000 VNĐ/tháng)`;
    },
    {
      name: "priceProduct",
      description: `Dùng khi người dùng hỏi về giá dịch vụ, kể cả nếu họ nói chung chung như 'giá của nó', 'giá dịch vụ đó'...`,
      schema: priceProductSchema,
    }
  );

  const tools = [advisoryNews, selectProduct, priceProduct];

  const res = await model
    .bindTools(tools)
    .invoke([...historyMessages, new HumanMessage(content)], config);

  const toolsByName = {
    advisoryNews: advisoryNews,
    selectProduct: selectProduct,
    priceProduct: priceProduct,
  };
  const messages = [];

  console.log("res: ", res);
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
