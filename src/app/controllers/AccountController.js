const Account = require("../models/Account");

class AccountController {
  //GET: account
  async get(req, res, next) {
    const query = await Account.find({});
    res.json(query);
  }

  async getById(req, res, next) {
    const query = await Account.findOne({ _id: req.params.id });
    res.json(query);
  }
  async create(req, res, next) {
    const query = await Account.create(req.body);
    res.json(query);
  }
}

module.exports = new AccountController();
