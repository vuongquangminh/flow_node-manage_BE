const express = require("express");
const router = express.Router();

const FlowController = require("../controllers/FlowController");

router.get("/flow", FlowController.get);
router.post("/flow", FlowController.post);

module.exports = router;
