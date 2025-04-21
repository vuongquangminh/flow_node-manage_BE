const Account = require("../models/Account");

class AccountController {
  //GET: account
  async get(req, res, next) {
    const query = await Account.find({});
    res.json(query);
  }
}

module.exports = new AccountController();
