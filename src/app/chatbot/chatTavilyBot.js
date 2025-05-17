require("cheerio");
const { TavilySearch } = require("@langchain/tavily");
const { model } = require("../utils");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");

const chatTavily = async ({ content }) => {
  const search = new TavilySearch({
    maxResults: 2,
    topic: "general",
  });
  const result = await search.invoke({
    query: content,
  });

  const articles = result.results?.map((item) => item.content).join("\n\n");

  console.log("articles: ", articles);

  const dataLlmsOutput = await model.invoke([
    new HumanMessage(`Hãy tóm tắt lại các thông tin này cho tôi : ${articles}`),
  ]);
  return dataLlmsOutput.content;
};

module.exports = { chatTavily };
