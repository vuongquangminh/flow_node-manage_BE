const authRoute = require("./auth");
const accountRoute = require("./account");
const flowRoute = require("./flow");
const authMiddleware = require("../middleware/authMiddleware");

function routeApp(app) {
  app.use("/api", authRoute);
  app.use("/api", authMiddleware, accountRoute);
  app.use("/api", authMiddleware, flowRoute);
}

module.exports = routeApp;
