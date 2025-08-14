const Product = require("../models/Product");

class ProductController {
  //GET: products
  async get(req, res, next) {
    try {
      // Lấy page từ query, mặc định là 1
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const query = await Product.find(
        req.params.type_bag ? { type_bag: req.params.type_bag } : {}
      )
        .sort({ createdAt: -1 }) // -1 là mới nhất
        .skip(skip) // bỏ qua số phần tử đã lấy
        .limit(limit);

      const total = await Product.countDocuments(
        req.params.type_bag ? { type_bag: req.params.type_bag } : {}
      );

      res.json({
        data: query,
        message: "Lấy dữ liệu Product thành công!",
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      next(err);
    }
  }
  //GET DETAIL: product
  async show(req, res) {
    try {
      const query = await Product.findOne({ _id: req.params.id });
      res.json({ data: query, message: "Lấy dữ liệu chi tiết thành công" });
    } catch (error) {
      next(err);
    }
  }
  //POST: product
  async post(req, res, next) {
    const data = await Product.create(req.body);
    if (data) {
      res.json({ message: "Bạn đã lưu dữ liệu Product thành công!", data });
    }
  }

  async getAll(req, res, next) {
    try {
      const query = await Product.find({});
      res.json({ data: query, message: "Lấy dữ liệu product thành công" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ProductController();
