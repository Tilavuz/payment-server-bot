import express from "express";
import { changeAuth, checkAuth, login } from "../controllers/auth.controller";
import { auth } from "../middleware/auth.middleware";
const router = express.Router();

router.post("/login", login);
router.put("/settings/auth/:id", auth, changeAuth);
router.get("/check_auth", auth, checkAuth);

export default router;
