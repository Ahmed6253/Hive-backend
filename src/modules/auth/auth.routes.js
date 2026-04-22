import { Router } from "express";

import {
  register,
  login,
  googleAuth,
  getUser,
  logout,
} from "./auth.controller.js";
import { checkAuth } from "../../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/google", googleAuth);
authRoutes.delete("/logout", logout);

authRoutes.get("/check", checkAuth, getUser);

export default authRoutes;
