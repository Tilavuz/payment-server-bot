import express, { json } from "express";
import { connectdb } from "./db/connect";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";
const app = express();

// Middleware
app.use(json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());

// Telegram bot
import "./bot/bot";

// Default controllers
import "./controllers/default.controllers";

// Connect data base
connectdb();

// Router
import router from "./routers/router";
app.use("/api", router);

import { port } from "./helpers/shared";

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});