const dotenv = require("dotenv");
dotenv.config();

const { URI, port, SECRET_ACCESS_TOKEN } = process.env;

module.exports = { URI, port, SECRET_ACCESS_TOKEN };
