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
    package: z.string().optional(), // ví dụ: "basic", "pro", "premium", "1 tháng", "12 tháng"
  });

  const selectPackageSchema = z.object({
    product: z.string().optional(), // có thể là undefined nếu dùng context
    package: z.string(), // ví dụ: "basic", "pro", "premium", "1 tháng", "12 tháng"
  });
  const customerInfoSchema = z.object({
    name: z.string(),
    phone: z.string().regex(/^\d{9,11}$/),
    email: z.string().email().optional(),
  });

  const submitOrderSchema = z.object({
    product: z.string(),
    package: z.string(), // ví dụ: "basic", "pro", "premium", "1 tháng", "12 tháng"
    name: z.string(),
    phone: z.string().regex(/^\d{9,11}$/),
    email: z.string().email().optional(),
  });

  const advisoryNews = tool(
    async () => {
      return `Bạn muốn được tư vấn về dịch vụ gì?`;
    },
    {
      name: "advisoryNews",
      description: "Người dùng muốn bắt đầu cuộc trò chuyện.",
    }
  );

  const suggestProduct = tool(
    async (input) => {
      return `Hiện tại đang có những dịch vụ như: Cpaas, Callbot, KYC, MyID`;
    },
    {
      name: "suggestProduct",
      description:
        "Dùng khi người dùng hỏi về dịch vụ nào (VD: 'Có những dịch vụ gì', 'Đang có dịch vụ nào', v.v.)",
    }
  );
  const selectProduct = tool(
    async (input, runContext) => {
      context.selectedProduct = input.product;
      const product =
        input.product || runContext?.configurable?.context?.selectedProduct;

      if (!product) {
        return "Bạn chưa chọn dịch vụ nào để tôi báo giá.";
      }
      return `Hiện tại dịch vụ ${product} đang có các gói cước như là... (ví dụ: 'Gói Pro ${product}', '1 tháng ${product}', '12 tháng ${product}', v.v.)`;
    },
    {
      name: "selectProduct",
      description:
        "Dùng khi người dùng muốn hỏi về các gói cước của dịch vụ đã chọn (ví dụ: 'Callbot', 'Chatbot', 'Tôi muốn xem các gói cước Chatbot', v.v)",
      schema: selectProductSchema,
    }
  );

  const selectPackage = tool(
    async (input, runContext) => {
      const product =
        input.product || runContext?.configurable?.context?.selectedProduct;

      if (!product) {
        return "Bạn chưa chọn dịch vụ nào để tôi báo giá.";
      } else if (!input.package) {
        return "Bạn chưa chọn gói cước cho dịch vụ";
      }
      context.selectpackage = input.package;

      return `Bạn đã chọn gói dịch vụ: ${product} - ${input.package}. Nhập thông tin Tên, SĐT, Email để đặt hàng`;
    },
    {
      name: "selectPackage",
      description:
        "Dùng khi người dùng xác nhận chọn gói cước vừa được đề xuất (VD: 'Gói Pro', '1 tháng', '12 tháng', 'Tôi muốn chọn gói Pro cho Cpaas', 'Cpaas - 1 tháng' v.v.)",
      schema: selectPackageSchema,
    }
  );
  const priceProduct = tool(
    async (input, runContext) => {
      const product =
        input.product || runContext?.configurable?.context?.selectedProduct;
      const package =
        input.package || runContext?.configurable?.context?.selectPackage;
      if (!product) {
        return "Bạn chưa chọn dịch vụ nào để tôi báo giá.";
      } else if (!package) {
        return "Bạn chưa chọn gói của dịch vụ. VD: Gói pro, gói 1 tháng, v.v";
      }
      return `Giá của dịch vụ ${product} với gói ${package} là ... (ví dụ: 500.000 VNĐ/tháng)`;
    },
    {
      name: "priceProduct",
      description: `Dùng khi người dùng hỏi về giá dịch vụ, kể cả nếu họ nói chung chung như 'giá của nó', 'giá dịch vụ đó'...`,
      schema: priceProductSchema,
    }
  );

  const inputCustomerInfo = tool(
    async (input, runContext) => {
      context.customer = input;
      const product =
        input.product || runContext?.configurable?.context?.selectedProduct;
      const package =
        input.package || runContext?.configurable?.context?.selectPackage;
      return `Đã nhận thông tin khách hàng: Dịch vụ: ${product}, Gói: ${package}, Tên: ${input.name}, SĐT: ${input.phone}. Gửi 'Xác nhận' để hoàn tất`;
    },
    {
      name: "inputCustomerInfo",
      description:
        "Dùng khi người dùng cung cấp thông tin cá nhân để đăng ký dịch vụ",
      schema: customerInfoSchema,
    }
  );

  const submitOrder = tool(
    async (input) => {
      const { selectedProduct, selectpackage, customer } = context;
      if (
        !(selectedProduct || input.product) ||
        !(selectpackage || input.package) ||
        !(customer || input.name)
      ) {
        return "Bạn cần chọn dịch vụ, gói và cung cấp thông tin trước khi đặt.";
      }

      // Ví dụ: xử lý đơn hàng ở đây (gọi API backend, ghi DB, v.v.)
      return `✅ Đặt dịch vụ thành công!\nDịch vụ: ${
        input.product || selectedProduct
      }\nGói: ${input.package || selectpackage}\nKhách hàng: ${
        input.name || customer.name
      } - ${input.phone || customer.phone}`;
    },
    {
      name: "submitOrder",
      description: `
Dùng khi người dùng cung cấp đầy đủ thông tin để đăng ký dịch vụ trong cùng một tin nhắn. 
Thông tin bao gồm: tên dịch vụ (product), gói dịch vụ (package), họ tên (name), số điện thoại (phone), 
có thể kèm email. Ví dụ:

- "Tôi muốn đặt dịch vụ Vbot gói 2 tháng. Tên Nguyễn Văn A, SĐT 0909123456"
- "Đăng ký Cpaas - 1 tháng. Tên Minh, số 0888123456, email minh@gmail.com"
`,
      schema: submitOrderSchema,
    }
  );

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
