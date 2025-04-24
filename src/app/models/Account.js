const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { SECRET_ACCESS_TOKEN } = require("../config/index");

const Schema = mongoose.Schema;

const AccountSchema = new Schema({
  name: { type: String, required: "Tên của bạn là bắt buộc", maxLength: 255 },
  email: {
    type: String,
    required: "Email của bạn là bắt buộc",
    maxLength: 255,
  },
  password: {
    type: String,
    required: "Mật khẩu của bạn là bắt buộc",
    maxLength: 600,
  },
  createAt: { type: Date, default: Date.now },
  upDateAt: { type: Date, default: Date.now },
});

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
  };
  return jwt.sign(payload, SECRET_ACCESS_TOKEN, {
    expiresIn: "220m",
  });
};

module.exports = mongoose.model("Account", AccountSchema);
