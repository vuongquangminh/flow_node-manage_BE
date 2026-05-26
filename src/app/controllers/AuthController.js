const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db");
const { SECRET_ACCESS_TOKEN } = require("../config");

class AuthController {
  async login(req, res, next) {
    const { email, password } = req.body;
    const account = await prisma.account.findUnique({ where: { email } });

    if (!account) {
      return res.status(404).json({ error: "Không tìm thấy tài khoản" });
    }

    const isPasswordValid = bcrypt.compareSync(password, account.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { id: account.id, email: account.email, name: account.name },
      SECRET_ACCESS_TOKEN,
      { expiresIn: "220m" }
    );
    return res.json({ user: account, token, message: "Đăng nhập thành công!" });
  }

  async create(req, res, next) {
    const { email, password, ...rest } = req.body;
    try {
      const existing = await prisma.account.findUnique({ where: { email } });
      if (existing) {
        return res.status(401).json({ error: "Email đã tồn tại" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const data = await prisma.account.create({
        data: { email, password: hashedPassword, ...rest },
      });
      return res.status(200).json({ data, status: "success", message: "Tạo tài khoản thành công" });
    } catch (error) {
      res.status(500).json({ status: error, code: 500, message: "Tạo tài khoản không thành công" });
    }
  }
}

module.exports = new AuthController();
