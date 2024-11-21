import { channelId } from "../../helpers/shared";
import { UserModel } from "../../models/user.model";
import bot from "../bot";

bot.on("chat_join_request", async (msg) => {
  try {
    const chatId = msg.from.id;
    const user = await UserModel.findOne({ chatId });
    
    if (!user) {
      return;
    }

    if (!channelId) {
      return;
    }

    if (user.isPaid === "deny_paid") {
      bot.declineChatJoinRequest(channelId, chatId);
      bot.sendMessage(chatId, "To'lovingiz bekor qilingan!");
      return;
    }

    if (user.isPaid === "not_paid") {
      bot.declineChatJoinRequest(channelId, chatId);
      bot.sendMessage(chatId, "To'lovni amalga oshiring!");
      return;
    }

    if (user.isPaid === "wait") {
      bot.declineChatJoinRequest(channelId, chatId);
      bot.sendMessage(chatId, "To'lovingiz tasdiqlanishini kuting!");
      return;
    }

    if (user.isPaid !== "paid") {
      bot.declineChatJoinRequest(channelId, chatId);
      bot.sendMessage(
        chatId,
        "Siz to'lovni amalga oshirmagansiz yoki admin sizni tasdiqlamagan!"
      );
      return;
    }

    if (user.isPaid === "paid") {
      bot.approveChatJoinRequest(channelId, chatId);
      bot.sendMessage(
        chatId,
        "Kanallar ro'yhatini tekshiring sizni kanalga qo'shdik!"
      );
      return;
    }
  } catch (error) {
    console.error(error);
  }
});