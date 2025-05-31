const { tool } = require("@langchain/core/tools");
const { default: axios } = require("axios");
const { z } = require("zod");
const fs = require("fs");
const { model } = require("../../utils");
const { HumanMessage } = require("@langchain/core/messages");
const { chatCustomTool } = require("../chatCustomTool");
const cron = require("node-cron");
const { chatTavily } = require("../chatTavilyBot");
const { AiSendMail } = require("./sendMail");

const weatherSchema = z.object({
  city: z.string(),
});

const commandMeSchema = z.object({
  target: z.string(),
  time: z.any(),
});

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

const commandMe = tool(
  async (input) => {
    console.log("input: ", input);
    const convert = await model.invoke(`
      Chuyển đổi văn bản sau thành biểu thức cron tương ứng (5 phần: phút giờ ngày tháng thứ).
      
      Văn bản: "${input.time}"
      Trả về cron: 
      `);
    cron.schedule(convert.content, async () => {
      console.log(`📅 Bắt đầu lấy ${input.target} theo ${input.time} ...`);

      const result = await chatTavily({ content: input.target });
      const kq = await AiSendMail({
        to: "vuongquangminh120802@gmail.com",
        subject: "Dự báo thời tiết hôm nay 🌤️",
        text: "Nhiệt độ hôm nay là 30 độ C. Trời có nắng.",
        html: `<h3>🌤️ Dự báo thời tiết</h3><p>Nhiệt độ hôm nay là <b>30°C</b>. Trời có nắng.</p>`,
      });
      console.log("ok: ", kq);
    });
    return "aaa";
  },
  {
    name: "commandMe",
    description:
      "Dùng khi người dùng hỏi về vấn đề lặp lịch cho 1 vấn đề gì đó VD: 'Lấy dữ liệu giá vàng vào lúc 11:34', 'Lấy dữ liệu thời tiết theo giờ', v.v",
    schema: commandMeSchema,
  }
);

module.exports = {
  weatherTool,
  commandMe,
};
