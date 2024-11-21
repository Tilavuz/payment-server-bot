import express from "express";
import { changeUser, getUser, getUsers } from "../controllers/user.controller";
import { auth } from "../middleware/auth.middleware";
const router = express.Router();

router.get("/users", auth, getUsers);
router.get("/users/:id", auth, getUser);
router.put("/users/change_user/:id", auth, changeUser);

export default router;
