import { Request, Response } from "express";
import { AuthModel } from "../models/auth.model";
import bcrypt from "bcrypt";
import { generateToken } from "../helpers/generate-token";

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, password } = req.body;

    const auth = await AuthModel.findOne({ username });

    if (!auth) {
      res.status(401).json({ message: "username da xatolik bor!" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, auth.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Noto‘g‘ri parol" });
      return;
    }

    const token = generateToken({ _id: `${auth._id}` });

    res.cookie("token", token, {
      httpOnly: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful!",
      auth: { username: auth.username, _id: auth._id },
    });
  } catch (error) {
    console.error(error);
  }
};

export const checkAuth = async (req: Request, res: Response) => {
  try {
    const { _id } = (req as any).auth;
    const auth = await AuthModel.findById(_id).select("-password");
    res.json(auth);
  } catch (error) {
    console.error(error);
  }
};

export const changeAuth = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const { id } = req.params;

    if (!username || !password) {
      res.status(400).json({ message: "Username va password talab qilinadi" });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedAuth = await AuthModel.findByIdAndUpdate(
      id,
      { password: hashedPassword, username },
      { new: true }
    );

    if (!updatedAuth) {
      res.status(404).json({ message: "Foydalanuvchi topilmadi" });
      return;
    }

    res.status(200).json({
      message: "Foydalanuvchi muvaffaqiyatli yangilandi",
      user: updatedAuth,
    });
  } catch (error) {
    console.error(error);
  }
};
