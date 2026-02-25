import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { createServer } from "http";

const app = express();
const server = createServer(app);

dotenv.config();
const PORT = process.env.PORT;

app.set("etag", false);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors({ origin: process.env.FRONT_BASE_URL, credentials: true }));
app.use(cookieParser());

server.listen(PORT, () => {
  console.log("server is running on " + PORT);
});
