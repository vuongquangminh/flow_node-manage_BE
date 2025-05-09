const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { HumanMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const { getContextVariable } = require("@langchain/core/context");

const modelForFunctionCalling = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  cache: true,
});

const langChainBot = async ({ content }) => {
  const adderSchema = z.object({
    a: z.number(),
    b: z.number(),
  });

  const multipleSchema = z.object({
    a: z.number(),
    b: z.number(),
  });

  const addTool = tool(
    async (input) => {
      const sum = input.a + input.b;
      return `The sum of ${input.a} and ${input.b} is ${sum}`;
    },
    {
      name: "addTool",
      description: "Adds two numbers together",
      schema: adderSchema,
    }
  );

  const multiplyTool = tool(
    async (input) => {
      const userId = getContextVariable("userId");
      //validate Error
      if (userId === undefined) {
        console.log(
          `No "userId" found in current context. Remember to call "setContextVariable('userId', value)";`
        );
      }
      const multiple = input.a * input.b;
      return `The multiple of ${input.a} and ${input.b} is ${multiple}`;
    },
    {
      name: "multiplyTool",
      description: "Multiples two numbers together",
      schema: multipleSchema,
    }
  );

  const tools = [addTool, multiplyTool];

  const res = await modelForFunctionCalling
    .bindTools(tools)
    .invoke([new HumanMessage(content)]);

  const toolsByName = {
    addTool: addTool,
    multiplyTool: multiplyTool,
  };
  const messages = [];

  for (const toolCall of res.tool_calls) {
    const selectedTool = toolsByName[toolCall.name];
    const toolMessage = await selectedTool.invoke(toolCall.args);
    console.log(("toolMessage: ", toolMessage));
    messages.push(toolMessage);
  }
  console.log("Tool results:", res);
  return res;
};

// Tavily is a search engine built specifically for AI agents (LLMs), delivering real-time, accurate, and factual results at speed
require("cheerio");
const { TavilySearch } = require("@langchain/tavily");

const tavilySearchRealtime = async ({ content }) => {
  const search = new TavilySearch({
    maxResults: 2,
    topic: "general",
  });
  const result = await search.invoke({
    query: content,
  });

  const articles = result.results?.map((item) => item.content).join("\n\n");

  console.log("articles: ", articles);

  const dataLlmsOutput = await modelForFunctionCalling.invoke([
    new HumanMessage(`Hãy tóm tắt lại các thông tin này cho tôi : ${articles}`),
  ]);
  return dataLlmsOutput.content;
};

// traning bot
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const {
  CheerioWebBaseLoader,
} = require("@langchain/community/document_loaders/web/cheerio");
const { RetrievalQAChain } = require("langchain/chains");

const trainingBot = async ({ content }) => {
  // 1. Load file .txt
  const pTagSelector = "p";
  const loader = new CheerioWebBaseLoader(
    "https://viblo.asia/p/top-5-cach-scale-nodejs-app-ma-ban-can-biet-oK9Vyg7XJQR",
    {
      selector: pTagSelector,
    }
  );
  const docs = await loader.load();

  // 2. Tách văn bản thành các đoạn nhỏ
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const documents = await splitter.splitDocuments(docs);

  // console.log("documents: ", documents);

  // 3. Biến thành vector và lưu vào MemoryVectorStore
  const vectorStore = await MemoryVectorStore.fromDocuments(
    documents,
    new OpenAIEmbeddings()
  );

  // 4. Biến thành retriever để truy vấn
  const retriever = vectorStore.asRetriever({
    k: 2, // chỉ lấy 2 đoạn giống nhất
  });
  // Nhúng RAG (retriever + llm)
  const chain = RetrievalQAChain.fromLLM(modelForFunctionCalling, retriever);

  // 5. Tìm đoạn phù hợp với truy vấn

  const response = await chain.invoke({
    query: content,
  });

  return response.text;
};

module.exports = { langChainBot, tavilySearchRealtime, trainingBot };
