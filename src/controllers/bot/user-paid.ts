import { Message } from "node-telegram-bot-api";
import axios from "axios";
import fs from "fs";
import path from "path";
import { PaymentModel } from "../../models/payment.model";
import { UserModel } from "../../models/user.model";
import bot from "../../bot/bot";
import { token } from "../../helpers/shared";
import { AmountModel } from "../../models/amount.model";

export const userPaid = async (msg: Message) => {
  try {
    const chatId = msg.from?.id;
    const photo = msg.photo;
    const fileId = photo ? photo[photo.length - 1].file_id : "";
    const amount = await AmountModel.findOne();

    if (!fileId) {
      throw new Error("Rasm topilmadi");
    }

    if (!chatId) {
      throw new Error("Chat id mavjut emas!");
    }

    const fileInfo = await bot.getFile(fileId);
    const filePath = fileInfo.file_path;

    const fileUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

    const response = await axios.get(fileUrl, { responseType: "arraybuffer" });

    const fileName = `payment_${chatId}_${Date.now()}.jpg`;
    const filePathToSave = path.join(__dirname, "../../uploads", fileName);

    fs.writeFileSync(filePathToSave, response.data);

    const payment = new PaymentModel({
      chatId,
      amount: amount?.value,
      screenshotUrl: `/uploads/${fileName}`,
    });
    await payment.save();

    let user = await UserModel.findOne({ chatId });
    if (user) {
      user.isPaid = "wait";
      user.action = "";
      await user.save();
    }

    bot.sendMessage(
      chatId,
      "Yuborgan rasmingiz saqlandi. 24 soat ichida tekshirib, sizni pullik kanalimizga qo'shamiz!"
    );
  } catch (error) {
    console.error("Xatolik yuz berdi:", error);
    if (msg.from?.id) {
      bot.sendMessage(
        msg.from.id,
        "Xatolik yuz berdi, iltimos qayta urinib ko'ring."
      );
    }
  }
};
