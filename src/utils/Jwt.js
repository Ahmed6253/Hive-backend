import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, env.jwtSecret, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //XSS attacts
    sameSite: "strict", //CSRF attackd
    secure: env.nodeEnv !== "development",
  });

  return token;
};

export const verifyToken = (token) => {
  return jwt.verify(token, env.jwtSecret);
};
