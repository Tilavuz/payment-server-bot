import { Message } from "node-telegram-bot-api";
import { UserModel, IUser } from "../../models/user.model";
import bot from "../../bot/bot";
import { menus } from "../../bot/constants/constants";

export const start = async (msg: Message) => {
  try {
    const chatId = msg.from?.id;
    const name = msg.from?.first_name;

    let user = await UserModel.findOne({ chatId });

    if (user && chatId) {
      if (user.status === "inactive") {
        user.status = "active";
        await user.save();
        bot.sendMessage(chatId, "Botga qaytganingizdan xursandmiz", {
          reply_markup: {
            keyboard: menus.mainMenu,
            resize_keyboard: true,
          },
        });
      } else if (user.status === "active") {
        bot.sendMessage(chatId, "Asosiy menu", {
          reply_markup: {
            keyboard: menus.mainMenu,
            resize_keyboard: true,
          },
        });
      }
    }

    if (!user && chatId) {
      user = new UserModel({ chatId, name });
      await user.save();
      bot.sendMessage(chatId, "Asosiy menu", {
        reply_markup: {
          keyboard: menus.mainMenu,
          resize_keyboard: true,
        },
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const startChannel = async (msg: Message) => {
  try {
    
  } catch (error) {
    console.error(error);
  }
}
