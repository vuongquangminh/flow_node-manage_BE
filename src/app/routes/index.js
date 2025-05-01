const authRoute = require("./auth");
const accountRoute = require("./account");
const chatRoute = require("./chat");
const authMiddleware = require("../middleware/authMiddleware");
const AccountController = require("../controllers/AccountController");

function routeApp(app) {
  app.use("/api", authRoute);
  app.use("/api", accountRoute);
  app.use("/api", authMiddleware, chatRoute);
}

module.exports = routeApp;
