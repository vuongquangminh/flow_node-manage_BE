const express = require("express");
const ProductController = require("../controllers/ProductController");
const router = express.Router();

router.get("/products", ProductController.get);
router.post("/product", ProductController.post);

module.exports = router;
