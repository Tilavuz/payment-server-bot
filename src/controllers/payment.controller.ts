import { Request, Response } from "express";
import { PaymentModel } from "../models/payment.model";
import { UserModel } from "../models/user.model";
import bot from "../bot/bot";
import { deletePhoto } from "../helpers/delete-photo";
import path from "path";
import { PaymentCalculationModel } from "../models/payment-calculation";
import { AmountModel } from "../models/amount.model";
import { InviteLinkModel } from "../models/invite-link.model";
import { TelegramAdminModel } from "../models/telegram-admin.model";

export const deletePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID is required!" });
      return;
    }

    const payment = await PaymentModel.findByIdAndDelete(id);

    if (!payment) {
      res.status(404).json({ message: "Payment not found!" });
      return;
    }
    const fullPath = path.join(__dirname, "..", payment?.screenshotUrl);
    deletePhoto(fullPath);

    res.status(200).json({ message: "Payment deleted successfully!", payment });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

export const approvePayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID kerak!" });
      return;
    }

    const updatedPayment = await PaymentModel.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );

    if (!updatedPayment) {
      res.status(404).json({ message: "To'lov topilmadi!" });
      return;
    }

    const user = await UserModel.findOneAndUpdate(
      { chatId: updatedPayment.chatId },
      {
        isPaid: "paid",
        endTime: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
      return;
    }

    const amount = await AmountModel.findOne();
    let paymentCalculation = await PaymentCalculationModel.findOne();

    if (amount && paymentCalculation) {
      paymentCalculation.sum += amount.value;
      await paymentCalculation.save();
    }

    const inviteLink = await InviteLinkModel.findOne();
    const telegramAdmin = await TelegramAdminModel.findOne();

    bot.sendMessage(
      user.chatId,
      "✅ **Chekingiz tasdiqlandi!**\n\n" +
        "Quidagi havola yordamida kanalga qo'shilishingiz mumkin! 📱📲\n\n" +
        `Agar biron bir xatolik yuzaga kelgan bo'lsa yoki kanalga qo'shilishda muammo bo'lsa, iltimos, admin bilan bog'laning: @${telegramAdmin?.value} 🙋‍♂️`,
      {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Kanalga qo'shilish",
                url: inviteLink?.inviteLink,
              },
            ],
          ],
        },
      }
    );

    res.status(200).json({
      message: "To'lov va foydalanuvchi ma'lumotlari tasdiqlandi!",
      updatedPayment,
      updatedUser: user,
    });
  } catch (error) {
    console.error("Tasdiqlashda xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
  }
};

export const denyPayment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ message: "ID kerak!" });
      return;
    }

    const deniedPayment = await PaymentModel.findByIdAndUpdate(
      id,
      { isApproved: false },
      { new: true }
    );

    if (!deniedPayment) {
      res.status(404).json({ message: "To'lov topilmadi!" });
      return;
    }

    const user = await UserModel.findOneAndUpdate(
      { chatId: deniedPayment.chatId },
      {
        isPaid: "deny_paid",
      },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ message: "Foydalanuvchi topilmadi!" });
      return;
    }

    bot.sendMessage(user.chatId, "Siz yuborgan check tasdiqlanmadi!");

    res.status(200).json({
      message: "To'lov rad etildi va foydalanuvchi yangilandi!",
      deniedPayment,
      updatedUser: user,
    });
  } catch (error) {
    console.error("To'lovni rad etishda xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
  }
};

export const getUnseenPaymentsCount = async (req: Request, res: Response) => {
  try {
    const unseenCount = await PaymentModel.countDocuments({ seen: false });

    res.status(200).json({
      message: "Ko'rilmagan to'lovlar soni:",
      count: unseenCount,
    });
  } catch (error) {
    console.error("Ko'rilmagan to'lovlar sonini olishda xatolik:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi!" });
  }
};
