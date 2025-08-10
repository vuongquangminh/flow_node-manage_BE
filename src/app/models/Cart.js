const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const CartSchema = new Schema(
  {
    _id: Number,
    product_id: Number,
    product_name: String,
    user_id: Number,
    user_name: String,
    price: String,
    image: String,
    size: String,
    color: String,
    quantity: Number,
    address: String,
    phone: String,
  },
  { _id: false, timestamps: true }
);

CartSchema.plugin(AutoIncrement, { id: "cart_id_counter" });

module.exports = mongoose.model("Cart", CartSchema);
