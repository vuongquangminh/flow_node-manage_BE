const authRoute = require("./auth");

function routeApp(app) {
  app.use("/", authRoute);
}

module.exports = routeApp;
