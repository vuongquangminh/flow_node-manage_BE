const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();
const port = require("./app/config/index");

// Kết nối DB và khai báo routes
const db = require("./app/config/db");
const routeApp = require("./app/routes");
const { socketConfig } = require("./app/sockets");

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

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey:
    "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",
});

const completion = openai.chat.completions.create({
  model: "gpt-4o-mini",
  store: true,
  messages: [{ role: "user", content: "câu 'tôi tên là Giang' trong tiếng anh là gì" }],
});

completion.then((result) => console.log("hihihi", result.choices[0].message));

// Bắt đầu server chung
server.listen(port.port, () => {
  console.log(`Server running at http://localhost:${port.port}`);
});
