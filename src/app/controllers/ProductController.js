const { prisma } = require("../config/db");

class ProductController {
  async get(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;
      const where = req.params.type_bag ? { type_bag: req.params.type_bag } : {};

      const [data, total] = await Promise.all([
        prisma.product.findMany({ where, orderBy: { createdAt: "desc" }, take: limit, skip }),
        prisma.product.count({ where }),
      ]);

      res.json({
        data,
        message: "Lấy dữ liệu Product thành công!",
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      next(err);
    }
  }

  async show(req, res, next) {
    try {
      const query = await prisma.product.findUnique({ where: { id: req.params.id } });
      res.json({ data: query, message: "Lấy dữ liệu chi tiết thành công" });
    } catch (error) {
      next(error);
    }
  }

  async search(req, res, next) {
    try {
      const query = await prisma.product.findMany({
        where: { name: { contains: req.query.name, mode: "insensitive" } },
        take: 4,
      });
      res.json({ data: query, message: "Lấy dữ liệu chi tiết thành công" });
    } catch (err) {
      next(err);
    }
  }

  async post(req, res, next) {
    const data = await prisma.product.create({ data: req.body });
    if (data) {
      res.json({ message: "Bạn đã lưu dữ liệu Product thành công!", data });
    }
  }

  async edit(req, res, next) {
    await prisma.product.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: "Bạn đã cập nhật dữ liệu Product thành công!" });
  }

  async getAll(req, res, next) {
    try {
      const query = await prisma.product.findMany();
      res.json({ data: query, message: "Lấy dữ liệu product thành công" });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const result = await prisma.product.delete({ where: { id: req.params.id } });
      res.json({ data: result, message: "Xóa dữ liệu Product thành công!" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
