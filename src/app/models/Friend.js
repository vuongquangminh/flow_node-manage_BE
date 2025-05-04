const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FriendSchema = new Schema(
  {
    _id: Number,
    id_user_1: {
      type: Number,
    },
    email_user_1: {
      type: String,
    },
    name_user_1: {
      type: String,
    },
    id_user_2: {
      type: Number,
      required: "id user 2 là bắt buộc",
      maxLength: 255,
    },
    email_user_2: {
      type: String,
      required: "Email user 2 là bắt buộc",
      maxLength: 255,
    },
    name_user_2: {
      type: String,
      required: "Tên user 2 là bắt buộc",
      maxLength: 600,
    },
    createAt: { type: Date, default: Date.now },
    upDateAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

FriendSchema.plugin(AutoIncrement, { id: "friend_id_counter" });

module.exports = mongoose.model("Friend", FriendSchema);
