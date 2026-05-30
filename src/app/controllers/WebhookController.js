const Stripe = require("stripe");
const { prisma } = require("../config/db");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class WebhookController {
  async handleStripeWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).json({ message: `Webhook signature failed: ${err.message}` });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const order_id = session.metadata?.order_id;
      if (order_id) {
        await prisma.order.update({ where: { id: order_id }, data: { status: 2 } });
      }
    }

    res.json({ received: true });
  }
}

module.exports = new WebhookController();
