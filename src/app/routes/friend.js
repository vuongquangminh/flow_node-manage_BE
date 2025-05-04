const express = require("express");
const FriendController = require("../controllers/FriendController");
const router = express.Router();

router.get("/list-friend", FriendController.index);

module.exports = router;
