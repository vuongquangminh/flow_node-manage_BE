const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey:
    "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",
});
const completion = async ({ content }) => {
  let conversationHistory = [];
  // Lưu tin nhắn của người dùng vào lịch sử
  conversationHistory.push({ role: "user", content: content });

  // Gửi yêu cầu đến OpenAI để nhận phản hồi
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    store: true,
    messages: conversationHistory, // Truyền toàn bộ lịch sử cuộc trò chuyện
  });

  // Lưu phản hồi của AI vào lịch sử
  const aiResponse = response.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: aiResponse });

  // Trả về phản hồi của AI cho người dùng
  return aiResponse;
};

module.exports = { completion };
