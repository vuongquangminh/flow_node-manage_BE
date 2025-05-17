const { ChatOpenAI } = require("@langchain/openai");

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  cache: true,
});

module.exports = { model };
