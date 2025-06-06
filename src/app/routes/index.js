const authRoute = require("./auth");
const accountRoute = require("./account");
const chatRoute = require("./chat");
const friendRoute = require("./friend");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");
const dotenv = require("dotenv");
const { google } = require("googleapis");

dotenv.config();

const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  FRONTEND_URL,
  REDIRECT_URI,
  SECRET_ACCESS_TOKEN,

  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} = process.env;

const scopes = ["openid", "email", "profile"];

const oauth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL
);

function routeApp(app) {
  app.use("/api", authRoute);
  app.use("/api", accountRoute);
  app.use("/api", authMiddleware, chatRoute);
  app.use("/api", authMiddleware, friendRoute);

  // GitHub OAuth2
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

  // Google OAuth2
  app.get("/auth/google", (_req, res) => {
    // Generate a url that asks permissions for the Drive activity and Google Calendar scope
    const authorizationUrl = oauth2Client.generateAuthUrl({
      // 'online' (default) or 'offline' (gets refresh_token)
      access_type: "offline",
      /** Pass in the scopes array defined above.
       * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
      scope: scopes,
      // Enable incremental authorization. Recommended as a best practice.
      include_granted_scopes: true,
    });
    res.redirect(authorizationUrl);
  });
  app.get("/auth/google/callback", async (req, res) => {
    const code = req.query.code;

    let { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      }
    );
    const payload = {
      id: response.data.id,
      email: response.data.email,
      name: response.data.name,
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
