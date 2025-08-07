const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const ProductSchema = new Schema(
  {
    _id: Number,
    name: String,
    price: String,
    image: String,
    type_bag: String,
    size: [String],
    color: [
      {
        id: Number,
        name: String,
        image_color: [String],
      },
    ],
    title: String,
    rate: String,
    sold: String,
    dimensions: String,
    weight: String,
    feature: [String],
    composition_maintenance: {
      title: String,
      composition: [String],
      entretien: [String],
    },
    sustainability_guarantee: {
      title: String,
      description: String,
      item: [
        {
          logo: String,
          title: String,
          description: String,
        },
      ],
    },
  },
  { _id: false, timestamps: true }
);

ProductSchema.plugin(AutoIncrement, { id: "product_id_counter" });

module.exports = mongoose.model("Product", ProductSchema);
