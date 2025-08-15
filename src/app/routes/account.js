const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/AccountController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/account/register", AccountController.create);
router.get("/account", authMiddleware, AccountController.get);
router.get("/account/me", authMiddleware, AccountController.me);
router.get("/account/:id", authMiddleware, AccountController.getById);
router.delete("/admin/account/:id", authMiddleware, AccountController.delete);

module.exports = router;
