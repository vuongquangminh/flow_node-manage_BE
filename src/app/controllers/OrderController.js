const Order = require("../models/Order");
const Product = require("../models/Product");

class OrderController {
  //GET: order
  async get(req, res, next) {
    try {
      const query = await Order.find({ user_id: req.params.user_id }).sort({
        createdAt: -1,
      });
      res.json({
        data: query,
        message: "Lấy dữ liệu Order thành công!",
      });
    } catch (err) {
      next(err);
    }
  }

  //POST: order
  async post(req, res, next) {
    const user = req.user;
    const body = req.body;

    const dataProducts = await Promise.all(
      body.products.map(async (item) => {
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
      })
    );

    const result = await Order.create({
      user_id: user.id,
      user_name: user.name,
      products: dataProducts,
      address: body.address,
      phone: body.phone,
      code: body.code,
    });
    if (result) {
      res.json({ message: "Đặt hàng thành công!", result });
    }
  }
}

module.exports = new OrderController();
