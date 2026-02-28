import { Router } from "express";

import { register, login, googleAuth, getUser } from "./auth.controller.js";
import { checkAuth } from "../../middleware/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/google", googleAuth);

authRoutes.get("/me", checkAuth, getUser);

export default authRoutes;
