const express = require("express");
const cors = require("cors");
const app = express();
const port = require("./app/config/index");

// CONFIGURE HEADER INFORMATION
// Allow request from any source. In real production, this should be limited to allowed origins only
app.use(cors());
app.disable("x-powered-by"); //Reduce fingerprinting
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = require("./app/config/db");
const routeApp = require("./app/routes");

db.connect();

// Basic route
routeApp(app);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
