const express = require("express");
const router = express.Router();

const FriendController = require("../controllers/FriendController");

router.post("/friend", FriendController.create);

module.exports = router;
