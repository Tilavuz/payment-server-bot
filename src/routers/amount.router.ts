import express from "express";
import { auth } from "../middleware/auth.middleware";
import { changeAmount, getAmount } from "../controllers/amount.controller";
const router = express.Router();


router.get('/settings/amount', auth, getAmount)
router.put('/settings/amount', auth, changeAmount)



export default router;