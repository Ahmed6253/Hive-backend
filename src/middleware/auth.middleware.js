import User from "../modules/user/user.model.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/Jwt.js";

export const checkAuth = async (req, res, next) => {
  try {
    const token = req.headers.cookie
      ?.split(";")
      .find((cookie) => cookie.trim().startsWith("jwt="))
      ?.split("=")[1];

    if (!token) {
      throw new ApiError(401, "Authentication token is missing.");
    }

    const decoded = verifyToken(token);

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new ApiError(401, "User not found.");
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
