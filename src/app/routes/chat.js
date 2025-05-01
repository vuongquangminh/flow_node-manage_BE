const express = require("express");
const router = express.Router();

const ChatController = require("../controllers/ChatController");

router.get("/history-message", ChatController.get);
router.post("/flow", ChatController.post);

module.exports = router;
