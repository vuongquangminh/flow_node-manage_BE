const express = require("express");
const ProductController = require("../controllers/ProductController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/products", ProductController.get);
router.get("/products/search", ProductController.search);
router.get("/products/:id", ProductController.show);
router.get("/admin/products", authMiddleware, ProductController.getAll);
router.post("/product", ProductController.post);
router.put("/product/:id", ProductController.edit);
router.delete("/product/:id", ProductController.delete);

module.exports = router;
