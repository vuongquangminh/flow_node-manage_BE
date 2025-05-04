const Account = require("../models/Account");
const Friend = require("../models/Friend");

class FriendController {
  async index(req, res, next) {
    const query = await Friend.find({
      $or: [
        {
          id_user_1: req.user.id,
        },
        {
          id_user_2: req.user.id,
        },
      ],
    });
    return res.json(query);
  }

}

module.exports = new FriendController();
