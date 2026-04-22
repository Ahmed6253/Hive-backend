import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";
import errorMiddleware from "./middleware/error.middleware.js";
import env from "./config/env.js";
import { connectDB } from "./config/db.js";
import authRoutes from "./modules/auth/auth.routes.js";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const app = express();
const server = createServer(app);

dotenv.config();
const PORT = env.port;

app.set("etag", false);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors({ origin: env.frontBaseUrl, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/spi/tasks", tasksRoutes);

app.use(errorMiddleware);

server.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectDB();
});
