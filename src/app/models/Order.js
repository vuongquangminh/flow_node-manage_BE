const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const OrderSchema = new Schema(
  {
    _id: Number,
    user_id: Number,
    user_name: String,
    products: [
      {
        product_id: Number,
        product_name: String,
        image: String,
        price: String,
        size: String,
        color: String,
        quantity: Number,
      },
    ],
    address: String,
    phone: String,
    code: String,
    status: Number,
  },
  { _id: false, timestamps: true }
);

OrderSchema.plugin(AutoIncrement, { id: "order_id_counter" });

module.exports = mongoose.model("Order", OrderSchema);
