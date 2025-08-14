const express = require("express");
const OrderController = require("../controllers/OrderController");
const router = express.Router();

router.get("/orders/:user_id", OrderController.get);
router.delete("/orders/:id", OrderController.delete);
router.post("/order", OrderController.post);
router.get("/admin/orders", OrderController.getAdmin);
router.post("/admin/orders/approve/:id", OrderController.approve);


module.exports = router;
