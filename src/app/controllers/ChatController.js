const Chat = require("../models/Chat");

class ChatController {
  //GET: message
  async get(req, res, next) {
    const query = await Chat.find({
      $and: [
        { $or: [{ sender_id: req.user.id }, { receiver_id: req.user.id }] },
        {
          $or: [
            { sender_id: req.query.receiver_id },
            { receiver_id: req.query.receiver_id },
          ],
        },
      ],
    })
      .sort({ createAt: "desc" })
      .limit(10);
    res.json(query.reverse());
  }
  async post(req, res, next) {
    const data = await Chat.create(req.body);
    if (data) {
      res.json({ data, message: "Bạn đã lưu dữ liệu Chat thành công" });
    }
  }
}

module.exports = new ChatController();
