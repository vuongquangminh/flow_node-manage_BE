const { prisma } = require("../config/db");

class FriendController {
  async index(req, res, next) {
    const query = await prisma.friend.findMany({
      where: {
        OR: [{ id_user_1: req.user.id }, { id_user_2: req.user.id }],
      },
    });
    return res.json(query);
  }
}

module.exports = new FriendController();
