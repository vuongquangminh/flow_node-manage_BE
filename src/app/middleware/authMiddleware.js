const jwt = require("jsonwebtoken");
const { SECRET_ACCESS_TOKEN } = require("../config");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Lấy token từ header: Bearer <token>
  if (!token) {
    return res.status(401).json({ message: "Bạn chưa đăng nhập!" });
  }

  try {
    const decoded = jwt.verify(token, SECRET_ACCESS_TOKEN); // Giải mã token
    req.user = decoded; // Gán thông tin người dùng vào req để dùng ở các route tiếp theo
    next();
  } catch (error) {
    return res
      .status(403)
      .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
  }
};

module.exports = authMiddleware;
