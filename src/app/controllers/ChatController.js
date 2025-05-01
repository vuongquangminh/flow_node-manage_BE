const Chat = require("../models/Chat");

class ChatController {
  //GET: account
  async get(req, res, next) {
    console.log(req.query._id);
    const query = await Chat.findOne({ _id: req.query._id });
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
