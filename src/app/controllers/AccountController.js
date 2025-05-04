const Account = require("../models/Account");
const Friend = require("../models/Friend");

class AccountController {
  //GET: account
  async get(req, res, next) {
    console.log(typeof req.user.id);
    const query = await Account.find({
      $and: [
        {
          _id: { $ne: req.user.id },
        },
        {
          friend_id: String(req.user.id),
        },
      ],
    });
    res.json(query);
  }

  async getById(req, res, next) {
    const query = await Account.findOne({ _id: req.params.id });
    res.json(query);
  }
  async create(req, res, next) {
    console.log("req.body: ", req.body);
    const query = await Account.create(req.body);

    res.json(query);
  }
}

module.exports = new AccountController();
