const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { HumanMessage, AIMessage } = require("@langchain/core/messages");
const { z } = require("zod");
const { tool } = require("@langchain/core/tools");
const { getContextVariable } = require("@langchain/core/context");

const model = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  cache: true,
});

const chatgpt = async ({ content, message, sessionId, config }) => {
  const historyMessages = [
    new HumanMessage("có mấy mục chính trong bài viết"),
    new AIMessage(
      "Bài viết có 7 mục chính, bao gồm:\n\n1. Giới thiệu\n2. Cách tính điểm và Bảng xếp hạng\n3. Giải thưởng BXH và Thành tựu đặc biệt\n4. Hãy đăng ký một tài khoản Viblo để nhận được nhiều bài viết thú vị hơn.\n5. Đăng nhập\n6. Đăng kí\n7. Thông tin"
    ),
    new HumanMessage(content), // câu mới bạn đang hỏi
  ];
  const response = await model.invoke(historyMessages);
  console.log("AI trả lời:", response.content);
  return response.content;
};
const chatTool = async ({ content }) => {
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

  const res = await model.bindTools(tools).invoke([new HumanMessage(content)]);

  const toolsByName = {
    addTool: addTool,
    multiplyTool: multiplyTool,
  };
  const messages = [];

  for (const toolCall of res.tool_calls) {
    const selectedTool = toolsByName[toolCall.name];
    const toolMessage = await selectedTool.invoke(toolCall.args);
    console.log("toolMessage: ", toolMessage);
    messages.push(toolMessage);
  }
  console.log("messages:", messages);
  return messages;
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

  const dataLlmsOutput = await model.invoke([
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

const embeddingBot = async ({ content }) => {
  const loader = new CheerioWebBaseLoader(
    "https://viblo.asia/announcements/chinh-thuc-cong-bo-the-le-chi-tiet-su-kien-viblo-mayfest-2025-decoding-a-decade-BQyJKvRQ4Me"
  );
  const docs = await loader.load();
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new OpenAIEmbeddings()
  );
  // Retrieve and generate using the relevant snippets of the blog.
  const retriever = vectorStore.asRetriever();
  //Tạo 1 chain và có lưu lịch sử trò chuyện
  const chain = ConversationalRetrievalQAChain.fromLLM(model, retriever);
  // 6. Người dùng chat nhiều lượt liên quan
  const response = await chain.invoke({
    question: content,
    chat_history: chatHistory,
  });

  // Cập nhật lịch sử chat
  chatHistory.push([content, response.text]);
  console.log("Q2:", response.text);
  console.log("chatHistory: ", chatHistory);
  return response.text;
};

// Chat Hisstory
const {
  StateGraph,
  MessagesAnnotation,
  END,
  START,
} = require("@langchain/langgraph");
const { v4 } = require("uuid");
const { InMemoryChatMessageHistory } = require("@langchain/core/chat_history");
const { ConversationalRetrievalQAChain } = require("langchain/chains");

const chatHistory = async () => {
  const chatsBySessionId = {};

  const getChatHistory = (sessionId) => {
    let chatHistory = chatsBySessionId[sessionId];
    if (!chatHistory) {
      chatHistory = new InMemoryChatMessageHistory();
      chatsBySessionId[sessionId] = chatHistory;
    }
    return chatHistory;
  };
  // Define the function that calls the model
  const callModel = async (state, config) => {
    // console.log("config: ", config);
    if (!config.configurable?.sessionId) {
      throw new Error(
        "Make sure that the config includes the following information: {'configurable': {'sessionId': 'some_value'}}"
      );
    }

    const chatHistory = getChatHistory(config.configurable.sessionId);
    console.log("chatHistory: ", chatHistory);

    let messages = [...(await chatHistory.getMessages()), ...state.messages];

    if (state.messages.length === 1) {
      // First message, ensure it's in the chat history
      await chatHistory.addMessage(state.messages[0]);
    }

    const aiMessage = await model.invoke(messages);

    // Update the chat history
    await chatHistory.addMessage(aiMessage);

    return { messages: [aiMessage] };
  };

  // Define a new graph
  const workflow = new StateGraph(MessagesAnnotation)
    .addNode("model", callModel)
    .addEdge(START, "model")
    .addEdge("model", END);

  const app = workflow.compile();

  // Create a unique session ID to identify the conversation
  const sessionId = v4();
  const config = { configurable: { sessionId }, streamMode: "values" };

  const inputMessage = new HumanMessage("hi! I'm bob");

  for await (const event of await app.stream(
    { messages: [inputMessage] },
    config
  )) {
    console.log("event: ", event);
    const lastMessage = event.messages[event.messages.length - 1];
    console.log(lastMessage.content);
  }

  // Here, let's confirm that the AI remembers our name!
  const followUpMessage = new HumanMessage("what was my name?");

  for await (const event of await app.stream(
    { messages: [followUpMessage] },
    config
  )) {
    const lastMessage = event.messages[event.messages.length - 1];
    console.log(lastMessage.content);
  }
};

module.exports = {
  chatgpt,
  chatTool,
  tavilySearchRealtime,
  embeddingBot,
  chatHistory,
};
