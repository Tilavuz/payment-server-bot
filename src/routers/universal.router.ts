import express from "express";
import { auth } from "../middleware/auth.middleware";
import { getStatistics } from "../controllers/universal.controller";
const router = express.Router();

router.get("/dashboard/statistics", auth, getStatistics);

export default router;
