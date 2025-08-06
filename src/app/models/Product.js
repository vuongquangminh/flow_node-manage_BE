const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = new Schema(
  {
    _id: Number,
    name: {
      type: String,
    },
    price: {
      type: String,
    },
    image: {
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

ProductSchema.plugin(AutoIncrement, { id: "product_id_counter" });

module.exports = mongoose.model("Product", ProductSchema);
