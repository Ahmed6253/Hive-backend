import User from "../modules/user/user.model.js";
import { verifyToken } from "../utils/Jwt.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.cookie
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Not authorized. No token provided." });
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
