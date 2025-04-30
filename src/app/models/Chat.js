const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ChatSchema = new Schema(
  {
    _id: Number,
    name_sent: String,
    sender_id: String,
    receiver_id: String,
    name_receiver: String,
    message: String,
    createAt: { type: Date, default: Date.now },
    upDateAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

ChatSchema.plugin(AutoIncrement, { id: "chat_id_counter" });

module.exports = mongoose.model("Chat", ChatSchema);
