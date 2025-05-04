const authRoute = require("./auth");
const accountRoute = require("./account");
const chatRoute = require("./chat");
const friendRoute = require("./friend");
const authMiddleware = require("../middleware/authMiddleware");

function routeApp(app) {
  app.use("/api", authRoute);
  app.use("/api", accountRoute);
  app.use("/api", authMiddleware, chatRoute);
  app.use("/api", authMiddleware, friendRoute);
}

module.exports = routeApp;
