const authRoute = require("./auth");
const accountRoute = require("./account");
const authMiddleware = require("../middleware/authMiddleware");

function routeApp(app) {
  app.use("/", authRoute);
  app.use("/", authMiddleware, accountRoute);
}

module.exports = routeApp;
