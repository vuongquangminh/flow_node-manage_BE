const { prisma } = require("../config/db");

class AccountController {
  async me(req, res, next) {
    const account = await prisma.account.findUnique({ where: { email: req.user.email } });
    res.json(account);
  }

  async get(req, res, next) {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  }

  async getById(req, res, next) {
    const account = await prisma.account.findUnique({ where: { id: req.params.id } });
    res.json(account);
  }

  async create(req, res, next) {
    const existing = await prisma.account.findUnique({ where: { email: req.body.email } });
    if (existing) {
      return res.status(404).json({ error: "Email đã tồn tại" });
    }
    const result = await prisma.account.create({ data: req.body });
    res.json(result);
  }

  async delete(req, res, next) {
    try {
      await prisma.account.delete({ where: { id: req.params.id } });
      res.json({ message: "Xoá user thành công" });
    } catch (error) {
      if (error.code === "P2025") {
        return res.status(404).json({ message: "Không tìm thấy user" });
      }
      next(error);
    }
  }
}

module.exports = new AccountController();
