const Account = require("../models/Account");
const Friend = require("../models/Friend");

class AccountController {
  //GET: account
  async me(req, res, next) {
    const query = await Account.findOne({ email: req.user.email });
    res.json(query);
  }
  async get(req, res, next) {
    const query = await Account.find({});
    res.json(query);
  }

  async getById(req, res, next) {
    const query = await Account.findOne({ _id: req.params.id });
    res.json(query);
  }
  async create(req, res, next) {
    const query = await Account.exists({ email: req.body.email });
    if (query) {
      return res.status(404).json({ error: "Email đã tồn tại" });
    }
    const result = await Account.create(req.body);

    res.json(result);
  }
}

module.exports = new AccountController();
