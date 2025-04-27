const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ChatSchema = new Schema({
  _id: Number,
  name: String,
  message: String,
  createAt: { type: Date, default: Date.now },
  upDateAt: { type: Date, default: Date.now },
},
{ _id: false });

ChatSchema.plugin(AutoIncrement);

module.exports = mongoose.model("Chat", ChatSchema);

