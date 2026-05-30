const { prisma } = require("../config/db");
const { SendMail } = require("../chatbot/tool.js/sendMail");

class OrderController {
  async get(req, res, next) {
    try {
      const query = await prisma.order.findMany({
        where: { user_id: req.params.user_id },
        orderBy: { createdAt: "desc" },
      });
      res.json({ data: query, message: "Lấy dữ liệu Order thành công!" });
    } catch (err) {
      next(err);
    }
  }

  async post(req, res, next) {
    const user = req.user;
    const body = req.body;

    const dataProducts = await Promise.all(
      body.products.map(async (item) => {
        const product = await prisma.product.findUnique({ where: { id: parseInt(item.product_id) } });
        const image = product.color.filter((img) => img.name == item.color);
        return {
          product_id: product.id,
          product_name: product.name,
          price: product.price,
          image: image[0].image_color[0],
          size: item.size,
          color: item.color,
          quantity: 1,
        };
      })
    );

    const result = await prisma.order.create({
      data: {
        user_id: user.id,
        user_name: user.name,
        products: dataProducts,
        address: body?.address,
        phone: body?.phone,
        code: body.code,
        status: 0,
      },
    });

    res.json({ message: "Đặt hàng thành công!", result });
  }

  async delete(req, res, next) {
    try {
      await prisma.order.update({ where: { id: req.params.id }, data: { status: 1 } });
      res.json({ data: null, message: "Xóa dữ liệu Order thành công!" });
    } catch (err) {
      next(err);
    }
  }

  async getAdmin(req, res, next) {
    try {
      const query = await prisma.order.findMany({ orderBy: { createdAt: "desc" } });
      res.json({ data: query, message: "Lấy dữ liệu Order thành công!" });
    } catch (err) {
      next(err);
    }
  }

  async approve(req, res, next) {
    try {
      const result = await prisma.order.update({
        where: { id: req.params.id },
        data: { status: req.body.status },
      });
      res.json({ data: result, message: "Xác nhận thanh toán!" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new OrderController();
