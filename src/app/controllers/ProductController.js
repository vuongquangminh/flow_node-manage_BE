const Product = require("../models/Product");

class ProductController {
  //GET: products
  async get(req, res, next) {
    const query = await Product.find(
      req.params.type_bag ? { type_bag: req.params.type_bag } : {}
    )
      .sort({ createAt: "desc" })
      .limit(10);
    res.json(query);
  }
  //POST: product
  async post(req, res, next) {
    const data = await Product.create(req.body);
    if (data) {
      res.json({ message: "Bạn đã lưu dữ liệu Product thành công!", data });
    }
  }
}

module.exports = new ProductController();
