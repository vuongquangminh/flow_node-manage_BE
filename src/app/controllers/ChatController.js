const { prisma } = require("../config/db");

class ChatController {
  async get(req, res, next) {
    const userId = String(req.user.id);
    const receiverId = req.query.receiver_id;

    const query = await prisma.chat.findMany({
      where: {
        AND: [
          { OR: [{ sender_id: userId }, { receiver_id: userId }] },
          { OR: [{ sender_id: receiverId }, { receiver_id: receiverId }] },
        ],
      },
      orderBy: { createAt: "desc" },
      take: 10,
    });
    res.json(query.reverse());
  }

  async post(req, res, next) {
    const data = await prisma.chat.create({ data: req.body });
    if (data) {
      res.json({ data, message: "Bạn đã lưu dữ liệu Chat thành công" });
    }
  }
}

module.exports = new ChatController();
