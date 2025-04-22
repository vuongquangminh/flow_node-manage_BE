const authRoute = require("./auth");
const accountRoute = require("./account");
const authMiddleware = require("../middleware/authMiddleware");

function routeApp(app) {
  app.use("/api", authRoute);
  app.use("/api", authMiddleware, accountRoute);
}

module.exports = routeApp;
