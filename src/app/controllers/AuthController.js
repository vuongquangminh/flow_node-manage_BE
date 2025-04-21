const bcrypt = require("bcrypt");

const Account = require("../models/Account");

class AuthController {
  //POST: /login
  async login(req, res, next) {
    const dataReq = req.body;
    const query = await Account.findOne({ email: dataReq.email });

    !query && res.status(404).json({ error: "Không tìm thấy tài khoản" });

    bcrypt.compare(dataReq.password, query.password, (err, result) => {
      if (err) {
        // Handle error
        res.status(500).json({ error: "Hệ thống đang bị lỗi" });
      }

      if (result) {
        // Passwords match, authentication successful
        res.json({ message: "Đăng nhập thành công!" });
      } else {
        // Passwords don't match, authentication failed
        res.status(404).json({ error: "Mật khẩu không đúng" });
      }
    });
  }

  // POST: create account to login
  async create(req, res, next) {
    try {
      const userPassword = "user_password"; // Replace with the actual password
      bcrypt.hash(userPassword, 1, (err, hash) => {
        if (err) {
          // Handle error
          res.status(404).json({ error: "lỗi" });
        }

        // Hashing successful, 'hash' contains the hashed password
        res.send(hash);
      });
      //   const data = await Account.create(req.body);
      //   res.json({ data, message: "Tạo tài khoản thành công" });
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new AuthController();
