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
    const { email } = req.body;
    try {
      const user = await Account.findOne({ email });

      if (user) {
        return res.status(401).json({ error: "Email đã tồn tại" });
      } else {
        const data = await Account.create(req.body);
        return res.status(200).json({
          data,
          status: "success",
          message: "Tạo tài khoản thành công",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: error,
        code: 500,
        message: "Tạo tài khoản không thành công",
      });
    }
  }
}
module.exports = new AuthController();
