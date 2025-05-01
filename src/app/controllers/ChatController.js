const Chat = require("../models/Chat");

class ChatController {
  //GET: message
  async get(req, res, next) {
    console.log(req.query.sender_id);
    const query = await Chat.find(req.query)
      .sort({ createAt: "desc" })
      .limit(10);
    res.json(query);
  }
  async post(req, res, next) {
    const data = await Chat.create(req.body);
    if (data) {
      res.json({ data, message: "Bạn đã lưu dữ liệu Chat thành công" });
    }
  }
}

module.exports = new ChatController();
