const { tool } = require("@langchain/core/tools");
const { default: axios } = require("axios");
const { z } = require("zod");
const fs = require("fs");
const { model } = require("../../utils");
const { HumanMessage } = require("@langchain/core/messages");
const selectProductSchema = z.object({
  product: z.string(),
});
const weatherSchema = z.object({
  city: z.string(),
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

const weatherTool = tool(
  async (input) => {
    try {
      const api = process.env.OPENWEATHER_API_KEY;
      const cityList = JSON.parse(
        fs.readFileSync("./src/data/city.list.json", "utf-8")
      );
      const city = cityList.filter((item) => item.name == input.city);
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?id=${city[0].id}&appid=${api}`
      );
      const prompt = `
Bạn là một trợ lý thời tiết. Tôi sẽ cung cấp dữ liệu JSON từ API thời tiết OpenWeather, 
hãy phân tích và trả về thông tin dễ hiểu cho người dùng.

Dữ liệu JSON:
${JSON.stringify(response.data, null, 2)}

Yêu cầu:
- Nêu rõ địa điểm (tên thành phố, quốc gia nếu có).
- Nhiệt độ hiện tại là bao nhiêu độ C?
- Thời tiết có nắng, mưa hay mây? (mô tả chi tiết).
- Tốc độ gió là bao nhiêu?
- Độ ẩm hiện tại là bao nhiêu phần trăm?
- Nếu có cảnh báo thời tiết đặc biệt thì hãy nêu rõ.

Trả lời bằng tiếng Việt, văn phong thân thiện, dễ hiểu. Giữ nguyên định dạng trên, đừng gộp vào một đoạn văn.
`;
      const llm = await model.invoke([new HumanMessage(prompt)]);
      return llm.content;
    } catch (err) {}
  },
  {
    name: "weatherTool",
    description:
      "Dùng khi người dùng hỏi về dẽ liệu thời tiết cụ thể theo ngày hoặc chung chung",
    schema: weatherSchema,
  }
);

module.exports = {
  advisoryNews,
  suggestProduct,
  selectProduct,
  selectPackage,
  priceProduct,
  inputCustomerInfo,
  submitOrder,
  weatherTool,
};
