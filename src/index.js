import express from "express";

import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import errorMiddleware from "./middleware/error.middleware.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import dns from "dns";
import tasksRoutes from "./modules/tasks/tasks.routes.js";
import groupRoutes from "./modules/groups/group.routes.js";
import { checkAuth } from "./middleware/auth.middleware.js";
import limiter from "./middleware/rateLimit.middleware.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const server = createServer(app);

const PORT = env.port;
app.use(cors({ origin: env.frontBaseUrl, credentials: true }));
app.use(cookieParser());

app.set("etag", false);
app.use(limiter);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/groups", checkAuth, groupRoutes);
app.use("/api/tasks", checkAuth, tasksRoutes);

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectDB();
});
