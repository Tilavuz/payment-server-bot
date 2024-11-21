import { Request, Response } from "express";
import { UserModel } from "../models/user.model";
import { PaymentModel } from "../models/payment.model";
import bot from "../bot/bot";
import { channelId } from "../helpers/shared";

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, isPaid, status, page = 1 } = req.query;

    const limit = 15;

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { chatId: { $regex: search, $options: "i" } },
      ];
    }

    if (isPaid) query.isPaid = isPaid;
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const users = await UserModel.find(query).skip(skip).limit(Number(limit));

    const totalUsers = await UserModel.countDocuments(query);

    res.status(200).json({
      message: "Foydalanuvchilar ro'yxati:",
      users,
      pagination: {
        totalUsers,
        currentPage: Number(page),
        totalPages: Math.ceil(totalUsers / Number(limit)),
      },
    });
  } catch (error) {
    console.error("Foydalanuvchilarni olishda xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findById(id);
    if (!user) {
      res.status(401).json({ message: "Foydalanuvchi topilmadi!" });
      return;
    }

    await PaymentModel.updateMany(
      { chatId: user.chatId },
      { $set: { seen: true } }
    );

    const payments = await PaymentModel.find({ chatId: user.chatId });

    res.json({ user, payments });
  } catch (error) {
    console.error(error);
  }
};

// *************** tekshirish kerak
export const checkUserJoinDate = async () => {
  try {
    if (!channelId) {
      return;
    }
    const today = new Date();

    const expiredUsers = await UserModel.find({
      endTime: { $lt: today },
    });

    if (expiredUsers.length === 0) {
      console.log("Bugun muddati tugagan foydalanuvchilar topilmadi.");
      return;
    }

    for (const user of expiredUsers) {
      await bot.sendMessage(
        user.chatId,
        "❌ **Obunangiz tugagan**. Kanaldagi obunangiz tugadi. Iltimos, yangilang."
      );

      await bot.banChatMember(channelId, parseInt(user.chatId, 10), {
        until_date: Math.floor(Date.now() / 1000) + 60,
      });
    }
  } catch (error) {
    console.error("Cron jobda xatolik yuz berdi:", error);
  }
};

export const changeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["block", "active"].includes(status)) {
      res.status(400).json({ message: "Noto'g'ri status qiymati." });
      return;
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      res.status(404).json({ message: "Foydalanuvchi topilmadi." });
      return;
    }

    res.status(200).json({
      message: `Foydalanuvchi muvaffaqiyatli yangilandi.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Foydalanuvchi statusini yangilashda xatolik:", error);
    res.status(500).json({ message: "Ichki server xatosi." });
  }
};
