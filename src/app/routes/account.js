const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/AccountController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/account", AccountController.create);
router.get("/account/:id", authMiddleware, AccountController.getById);
router.get("/account", authMiddleware, AccountController.get);

module.exports = router;
