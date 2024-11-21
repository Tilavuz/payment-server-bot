import { Message } from "node-telegram-bot-api";
import bot from "../../bot/bot";
import { UserModel } from "../../models/user.model";
import { actions } from "../../bot/constants/constants";

export const joinGroup = async (msg: Message) => {
  try {
    const chatId = msg.from?.id;
    await UserModel.findOneAndUpdate({ chatId }, { action: actions.joinTheGroup })

    if (chatId) {
      bot.sendMessage(
        chatId,
        `Salom! Kanalga qo'shilish uchun to'lovni amalga oshirishingiz kerak.

            1. <b>Kartaga pul o'tkazing:</b> 25 ming so'm
            
            <b>XXXXXXXXXXXXXXXX</b>
            
            2. <b>Screenshot yuboring:</b>
To'lovni amalga oshirgandan so'ng, iltimos, ekranning skrinshotini yuboring. Bu sizning to'lovni amalga oshirganingizni tasdiqlovchi dalil bo'ladi.😊`,
        { parse_mode: "HTML" }
      );
    }
  } catch (error) {
    console.error(error);
  }
};
