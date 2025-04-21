const bcrypt = require("bcrypt");

const Account = require("../models/Account");
class AuthController {
  //POST: /login
  async login(req, res, next) {
    const dataReq = req.body;
    const query = await Account.findOne({ email: dataReq.email });

    !query && res.status(404).json({ error: "Không tìm thấy tài khoản" });

    const isPasswordValid = bcrypt.compareSync(
      dataReq.password,
      query.password
    );
    isPasswordValid
      ? res.json({ message: "Đăng nhập thành công!" })
      : res.status(401).json({ error: "Mật khẩu không đúng" });

  }

  // POST: create account to login
  async create(req, res, next) {
      const { name, email, password } = req.body;
    try {
      const data = await Account.create(req.body);
      res.json({ data, message: "Tạo tài khoản thành công" });
    } catch (error) {
      throw error;
    }
  }
}
module.exports = new AuthController();
