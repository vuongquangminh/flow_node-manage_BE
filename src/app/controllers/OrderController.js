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
        const image = await product.color.filter(
          (img) => img.name == item.color
        );
        return {
          product_id: product._id,
          product_name: product.name,
          price: product.price,
          image: image[0].image_color[0],
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
      status: 0,
    });
    if (result) {
      res.json({ message: "Đặt hàng thành công!", result });
    }
  }

  //DELETE: order
  async delete(req, res, next) {
    try {
      const result = await Order.updateOne(
        {
          _id: req.params.id,
        },
        { status: 1 }
      );
      res.json({
        data: result,
        message: "Xóa dữ liệu Order thành công!",
      });
    } catch (err) {
      next(err);
    }
  }
  async getAdmin(req, res, next) {
    try {
      const query = await Order.find({}).sort({
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

  async approve(req, res, next) {
    try {
      console.log("status: ", req.body);
      const result = await Order.updateOne(
        {
          _id: req.params.id,
        },
        { status: req.body.status }
      );
      res.json({
        data: result,
        message: "Xác nhận thanh toán!",
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
