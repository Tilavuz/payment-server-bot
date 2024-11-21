import { Request, Response } from "express";
import bot from "../bot/bot";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import { UserModel } from "../models/user.model";

export const sendMessageUser = async (req: Request, res: Response) => {
  try {
    const { message, chatId } = req.body;

    if (!message || !chatId) {
      res.status(401).json({ message: "Inputni to'ldiring!" });
      return;
    }
    bot.sendMessage(chatId, message);
    res.json({ message: "Habar yuborildi" });
  } catch (error) {
    res.status(501).json({ message: "Server error!" });
    console.error(error);
  }
};

export const sendPhotoUser = async (req: Request, res: Response) => {
  const { caption, chatId } = req.body;

  if (!req.file) {
    res.status(400).json({ message: "Serverga rasm kelmadi!" });
    return;
  }

  const fileExtension = path.extname(req.file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = path.join(__dirname, "../uploads", fileName);

  try {
    fs.writeFileSync(filePath, req.file.buffer);

    await bot.sendPhoto(
      chatId,
      filePath,
      { caption },
      { filename: fileName, contentType: req.file.mimetype }
    );

    res.json({ message: "Habar yuborildi" });
  } catch (error) {
    console.error("Xato:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
  } finally {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

export const sendMessageAllUsers = async (req: Request, res: Response) => {
  try {
    const { caption } = req.body;
    const users = await UserModel.find({ status: "active" });

    if (!users.length) {
      res
        .status(404)
        .json({ message: "Hech qanday faol foydalanuvchi topilmadi" });
      return;
    }

    if (req.file) {
      const fileExtension = path.extname(req.file.originalname);
      const fileName = `${uuidv4()}${fileExtension}`;
      const filePath = path.join(__dirname, "../uploads", fileName);

      try {
        // Faylni saqlash
        await fs.promises.writeFile(filePath, req.file.buffer);

        res.status(200).json({
          message:
            "Xabarlar va rasm yuborish jarayoni boshlandi! Bu bazadagi foydalanuvchilar soniga qarab ko'proq vaqt olishi mumkin!",
        });

        // Foydalanuvchilarga xabarlarni ketma-ket yuborish
        for (const user of users) {
          try {
            await bot.sendPhoto(user.chatId, filePath, { caption });
          } catch (error) {
            console.error(`Error sending photo to user ${user._id}:`, error);
          }
        }
      } finally {
        // Faylni o'chirish
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
      }
    } else {
      // Foydalanuvchilarga faqat matnli xabar yuborish
      const sendPromises = users.map((user) =>
        bot.sendMessage(user.chatId, caption).catch((error) => {
          console.error(`Error sending message to user ${user._id}:`, error);
        })
      );

      await Promise.all(sendPromises);

      res
        .status(200)
        .json({ message: "Faol foydalanuvchilarga matnli xabar yuborildi" });
    }
  } catch (error) {
    console.error("Server xatosi:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};
