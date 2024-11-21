import express from "express";
import { auth } from "../middleware/auth.middleware";
import {
  sendMessageUser,
  sendPhotoUser,
  sendMessageAllUsers,
} from "../controllers/message.controller";
import multer from "multer";
const router = express.Router();
const upload = multer();

router.post("/send_message_user", auth, sendMessageUser);
router.post("/send_photo_user", auth, upload.single("photo"), sendPhotoUser);
router.post(
  "/send_message_all_user",
  auth,
  upload.single("photo"),
  sendMessageAllUsers
);

export default router;
