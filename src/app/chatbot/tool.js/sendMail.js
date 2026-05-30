const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const dotenv = require("dotenv");
dotenv.config();

const { EMAIL_USER, EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET, EMAIL_REFRESH_TOKEN } = process.env;

const oauth2Client = new google.auth.OAuth2(EMAIL_CLIENT_ID, EMAIL_CLIENT_SECRET);
oauth2Client.setCredentials({ refresh_token: EMAIL_REFRESH_TOKEN });

const SendMail = async ({ to, subject, text, html }) => {
  const { token: accessToken } = await oauth2Client.getAccessToken();

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: EMAIL_USER,
      clientId: EMAIL_CLIENT_ID,
      clientSecret: EMAIL_CLIENT_SECRET,
      refreshToken: EMAIL_REFRESH_TOKEN,
      accessToken,
    },
  });

  const mailOptions = { from: EMAIL_USER, to, subject, text, html };

  try {
    const result = await transporter.sendMail(mailOptions);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { SendMail };
