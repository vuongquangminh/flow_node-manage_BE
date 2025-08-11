const Order = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
  //GET: order
  async get(req, res, next) {
    try {
      // Lấy page từ query, mặc định là 1
      const page = parseInt(req.query.page) || 1;
      const limit = 5;
      const skip = (page - 1) * limit;

      const query = await Order.find(
        req.query.name ? { type_bag: req.query.name } : {}
      )
        .sort({ createdAt: -1 }) // -1 là mới nhất
        .skip(skip) // bỏ qua số phần tử đã lấy
        .limit(limit);

      const total = await Order.countDocuments(
        req.params.type_bag ? { type_bag: req.params.type_bag } : {}
      );

      res.json({
        data: query,
        message: "Lấy dữ liệu Order thành công!",
        total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      next(err);
    }
  }

  //POST: order
  async post(req, res, next) {
    const user = req.user;
    const body = req.body;

    const dataProducts = await Promise.all(body.products.map( async(item) => {
      const product = await Product.findOne({ _id: item.product_id });
      return {
        product_id: product._id,
        product_name: product.name,
        price: product.price,
        image: product.image,
        size: item.size,
        color: item.color,
        quantity: 1,
      };
    }));

    const result = await Order.create({
      user_id: user.id,
      user_name: user.name,
      products: dataProducts,
      address: body.address,
      phone: body.phone
    });
    if (result) {
      res.json({ message: "Đặt hàng thành công!", result });
    }
  }
}

module.exports = new OrderController();
