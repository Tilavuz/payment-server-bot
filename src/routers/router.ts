import express from "express";
const router = express.Router();
import userRouter from "./user.router";
import authRouter from "./auth.router";
import paymentRouter from "./payment.router";
import messageRouter from "./message.router";
import universalRouter from "./universal.router";
import amountRouter from "./amount.router";
import inviteLinkRouter from "./invite-link.router";
import telegramAdminRouter from "./telegram-admin.router";

router.use("/", userRouter);
router.use("/", paymentRouter);
router.use("/", authRouter);
router.use("/", messageRouter);
router.use("/", universalRouter);
router.use("/", amountRouter);
router.use("/", inviteLinkRouter);
router.use("/", telegramAdminRouter);

export default router;
