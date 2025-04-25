const express = require("express");
const router = express.Router();

const AccountController = require("../controllers/AccountController");

router.get("/account", AccountController.get);
router.get("/account/:id", AccountController.getById);

module.exports = router;
