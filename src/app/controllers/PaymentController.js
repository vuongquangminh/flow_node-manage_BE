const Stripe = require("stripe");
const { prisma } = require("../config/db");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class PaymentController {
  async createCheckoutSession(req, res, next) {
    try {
      const { order_id } = req.body;
      const order = await prisma.order.findUnique({ where: { id: order_id } });
      if (!order) return res.status(404).json({ message: "Order not found" });

      const line_items = order.products.map((p) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: p.product_name,
            images: p.image ? [p.image] : [],
          },
          unit_amount: Math.round(parseFloat(p.price) * 100),
        },
        quantity: p.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/payment/success?order_id=${order_id}`,
        cancel_url: `${process.env.FRONTEND_URL}/order`,
        metadata: { order_id },
      });

      res.json({ url: session.url });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new PaymentController();
