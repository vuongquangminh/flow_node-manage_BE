
const express = require("express");
const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(express.json());

const db = require("./app/config/db");
db.connect();

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Hello World11!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
