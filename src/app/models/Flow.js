const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const FlowSchema = new Schema({
  _id: Number,
  nodes: String,
  edges: String,
  createAt: { type: Date, default: Date.now },
  upDateAt: { type: Date, default: Date.now },
},
{ _id: false });

FlowSchema.plugin(AutoIncrement);

module.exports = mongoose.model("Flow", FlowSchema);

