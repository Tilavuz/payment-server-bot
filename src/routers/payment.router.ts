import express from "express";
import { auth } from "../middleware/auth.middleware";
import {
  approvePayment,
  deletePayment,
  denyPayment,
  getUnseenPaymentsCount,
} from "../controllers/payment.controller";
const router = express.Router();

router.delete("/payment_delete/:id", auth, deletePayment);
router.put("/approve_payment/:id", auth, approvePayment);
router.put("/deny_payment/:id", auth, denyPayment);
router.get("/payments/unseen-count", auth, getUnseenPaymentsCount);

export default router;
