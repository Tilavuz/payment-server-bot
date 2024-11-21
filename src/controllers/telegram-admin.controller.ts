import { Request, Response } from "express";
import { TelegramAdminModel } from "../models/telegram-admin.model";

export const getTelegramAdmin = async (req: Request, res: Response) => {
  try {
    const TelegramAdmin = await TelegramAdminModel.findOne();
    res.json(TelegramAdmin);
  } catch (error) {
    console.error(error);
  }
};

export const changeTelegramAdmin = async (req: Request, res: Response) => {
  try {
    const { value } = req.body;

    let oldTelegramAdmin = await TelegramAdminModel.findOne();

    if (!oldTelegramAdmin) {
      res.status(401).json({ message: "Telegram admin mavjut emas!" });
      return;
    }
    oldTelegramAdmin.value = value;

    await oldTelegramAdmin.save();

    res.json({
      message: "Malumot yangilandi!",
      TelegramAdmin: oldTelegramAdmin,
    });
  } catch (error) {
    console.error(error);
  }
};
