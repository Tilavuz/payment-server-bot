import express from "express";
import { auth } from "../middleware/auth.middleware";
import {
  changeInviteLink,
  getInviteLink,
} from "../controllers/invite-link.controller";
const router = express.Router();

router.get("/settings/invite_link", auth, getInviteLink);
router.put("/settings/invite_link", auth, changeInviteLink);

export default router;
