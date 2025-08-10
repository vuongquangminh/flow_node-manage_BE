const express = require("express");
const CartController = require("../controllers/CartController");
const router = express.Router();

router.get("/carts", CartController.get);
router.post("/cart", CartController.post);

module.exports = router;
