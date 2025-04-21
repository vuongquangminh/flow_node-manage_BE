const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  name: { type: String, maxLength: 255 },
  email: { type: String, maxLength: 255 },
  password: { type: String, maxLength: 600 },
  createAt: { type: Date, default: Date.now },
  upDateAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Account", AccountSchema);
