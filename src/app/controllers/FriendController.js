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

  async create(req, res, next) {
    const query = await Friend.findOne({
      $or: [
        {
          email_user_1: req.user.email,
          email_user_2: req.body.email_other_person,
        },
        {
          email_user_1: req.body.email_other_person,
          email_user_2: req.user.email,
        },
      ],
    });
    if (query) {
      return res.json({ message: "Đã kết bạn!" });
    }

    const checkExit = await Account.findOne({
      _id: req.body.id_other_person,
      email: req.body.email_other_person,
    });
    if (checkExit) {
      const new_record = await Friend.create({
        id_user_1: req.user.id,
        email_user_1: req.user.email,
        name_user_1: req.user.name,
        id_user_2: req.body.id_other_person,
        email_user_2: req.body.email_other_person,
        name_user_2: req.body.name_other_person,
      });
      return res.json(new_record);
    } else {
      return res.json({ message: "Bạn mới không tồn tại!" });
    }
  }
}

module.exports = new FriendController();
