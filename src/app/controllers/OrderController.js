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
        const product = await prisma.product.findUnique({ where: { id: item.product_id } });
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
        address: body.address,
        phone: body.phone,
        code: body.code,
        status: 0,
      },
    });

    if (result) {
      await SendMail({
        to: user.email,
        subject: "Thông báo đơn hàng!",
        text: `Bạn đã đặt hàng thành công với mã đơn hàng là: ${result.code}`,
        html: `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #2c3e50;">Đặt hàng thành công!</h2>
      <p>Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là:
        <strong style="color: #e74c3c;">${result.code}</strong>
      </p>
      <h3 style="margin-top: 20px; color: #2c3e50;">Chi tiết đơn hàng:</h3>
      <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f4f6f8;">Sản phẩm</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f4f6f8;">Size</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f4f6f8;">Màu</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f4f6f8;">Số lượng</th>
            <th style="border: 1px solid #ddd; padding: 8px; background: #f4f6f8;">Giá</th>
          </tr>
        </thead>
        <tbody>
          ${dataProducts
            .map(
              (item) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.product_name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.size}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.color}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align:center;">${item.quantity}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align:right;">${item.price.toLocaleString()} $</td>
              </tr>`
            )
            .join("")}
        </tbody>
      </table>
      <p style="margin-top: 20px;">Chúng tôi sẽ liên hệ để xác nhận và giao hàng sớm nhất.</p>
      <p style="margin-top: 10px; font-size: 14px; color: #7f8c8d;">
        Nếu có thắc mắc, vui lòng liên hệ hotline <strong>0869952231</strong>.
      </p>
    </div>`,
      });
      res.json({ message: "Đặt hàng thành công!", result });
    }
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
