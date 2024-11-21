import express from "express";
import { auth } from "../middleware/auth.middleware";
import {
  changeTelegramAdmin,
  getTelegramAdmin,
} from "../controllers/telegram-admin.controller";
const router = express.Router();

router.get("/settings/telegram_admin", auth, getTelegramAdmin);
router.put("/settings/telegram_admin", auth, changeTelegramAdmin);

export default router;
