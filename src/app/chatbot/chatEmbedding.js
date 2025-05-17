
const { ChatOpenAI, OpenAIEmbeddings } = require("@langchain/openai");
const { TextLoader } = require("langchain/document_loaders/fs/text");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { ConversationalRetrievalQAChain } = require("langchain/chains");
const {
  CheerioWebBaseLoader,
} = require("@langchain/community/document_loaders/web/cheerio");
const { model } = require("../utils");

let chatHistory = [];
const chatEmbeddingBot = async ({ content }) => {
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

module.exports = { chatEmbeddingBot };
