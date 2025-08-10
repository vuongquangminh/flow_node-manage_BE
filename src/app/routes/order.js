const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

router.get("/orders", OrderController.get);
router.post("/order", OrderController.post);

module.exports = router;
