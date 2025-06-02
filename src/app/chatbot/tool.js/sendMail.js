// sendMail.js
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const {
  EMAIL_USER,
  EMAIL_APP_PASSWORD, // Thêm biến này vào .env
} = process.env;

const AiSendMail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: EMAIL_USER,
    to,
    subject,
    text,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = { AiSendMail };
