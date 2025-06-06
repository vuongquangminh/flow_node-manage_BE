const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/AccountController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/account", AccountController.create);
router.get("/account", authMiddleware, AccountController.get);
router.get("/account/me", authMiddleware, AccountController.me);
router.get("/account/:id", authMiddleware, AccountController.getById);

module.exports = router;
