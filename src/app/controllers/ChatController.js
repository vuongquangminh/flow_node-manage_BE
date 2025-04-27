const Flow = require("../models/Chat");

class FlowController {
  //GET: account
  async get(req, res, next) {
    console.log(req.query._id);
    const query = await Flow.findOne({ _id: req.query._id });
    res.json(query);
  }
  async post(req, res, next) {
    const data = await Flow.create(req.body);
    if (data) {
      res.json({ data, message: "Bạn đã lưu dữ liệu flow thành công" });
    }
  }
}

module.exports = new FlowController();
