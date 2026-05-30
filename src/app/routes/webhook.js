const express = require("express");
const WebhookController = require("../controllers/WebhookController");
const router = express.Router();

router.post(
  "/webhook/stripe",
  express.raw({ type: "application/json" }),
  WebhookController.handleStripeWebhook
);

module.exports = router;
