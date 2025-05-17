const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const port = require("./app/config/index");

// Kết nối DB và khai báo routes
const db = require("./app/config/db");
const routeApp = require("./app/routes");
const { socketConfig } = require("./app/sockets");
const {
  langChainBot,
  tavilySearchRealtime,
  traniingBot,
  chatHistory,
  chatgpt,
} = require("./app/chatbot/langChainBot");
const { aiAgent } = require("./app/chatbot/agent");

// Tạo server HTTP từ app
const server = http.createServer(app);

// Middleware cấu hình cho Express
app.use(cors());
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

db.connect();
routeApp(app);
//socket
socketConfig(server);

// langChainBot();
// tavilySearchRealtime();
// trainingBot()
// chatHistory()
aiAgent();
// chatgpt({ content: "Tôi vừa hỏi gì" });

// Bắt đầu server chung
server.listen(port.port, () => {
  console.log(`Server running at http://localhost:${port.port}`);
});
