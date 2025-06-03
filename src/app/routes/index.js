const authRoute = require("./auth");
const accountRoute = require("./account");
const chatRoute = require("./chat");
const friendRoute = require("./friend");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
dotenv.config();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL,
  REDIRECT_URI,
  SECRET_ACCESS_TOKEN,
} = process.env;

function routeApp(app) {
  app.use("/api", authRoute);
  app.use("/api", accountRoute);
  app.use("/api", authMiddleware, chatRoute);
  app.use("/api", authMiddleware, friendRoute);
  app.get("/auth/github", (_req, res) => {
    const redirectUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user:email`;
    res.redirect(redirectUrl);
  });

  app.get("/auth/github/callback", async (req, res) => {
    const code = req.query.code;
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    let email = userResponse.data.email;
    if (!email) {
      // Nếu email bị ẩn, gọi thêm API này
      const emailsResponse = await axios.get(
        "https://api.github.com/user/emails",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // Tìm email primary và verified
      const primaryEmail = emailsResponse.data.find(
        (e) => e.primary && e.verified
      );
      email = primaryEmail ? primaryEmail.email : null;
    }

    console.log("email: ", email);
    const payload = {
      id: userResponse.id,
      email: email,
      name: userResponse.name,
    };
    const accessTokenApp = jwt.sign(payload, SECRET_ACCESS_TOKEN, {
      expiresIn: "220m",
    });
    res.redirect(
      `${FRONTEND_URL}/oauth-callback?access_token=${accessTokenApp}`
    );
  });
}

module.exports = routeApp;
