const express = require("express");
const ProductController = require("../controllers/ProductController");
const router = express.Router();

router.get("/products", ProductController.get);
router.get("/products/search", ProductController.search);
router.get("/products/:id", ProductController.show);
router.post("/product", ProductController.post);
router.get("/admin/products", ProductController.getAll);

module.exports = router;
