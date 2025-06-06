const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_ACCESS_TOKEN } = require("../config/index");

const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);

const AccountSchema = new Schema(
  {
    _id: Number,
    name: { type: String, required: "Tên của bạn là bắt buộc" },
    email: {
      type: String,
      required: "Email của bạn là bắt buộc",
      maxLength: 255,
    },
    password: {
      type: String,
      maxLength: 600,
    },
    friend: {
      type: Number,
    },
    status: {
      type: Boolean,
    },
    createAt: { type: Date, default: Date.now },
    upDateAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

AccountSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

AccountSchema.methods.generateAccessJWT = function () {
  let payload = {
    id: this._id,
    email: this.email,
    name: this.name
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: "220m",
  });
};

AccountSchema.plugin(AutoIncrement, { id: "account_id_counter" });

module.exports = mongoose.model("Account", AccountSchema);
