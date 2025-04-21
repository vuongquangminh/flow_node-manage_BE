const mongoose = require("mongoose");
const { URI } = require("../../config/index");

async function connect() {
  try {
    await mongoose.connect(URI, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      // useCreateIndex: true
    });

    console.log("connect success");
  } catch (error) {
    console.log("connect false");
  }
}
module.exports = { connect };
