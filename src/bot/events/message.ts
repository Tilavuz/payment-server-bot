import { UserModel } from "../../models/user.model";
import bot from "../bot";
import { start } from "../../controllers/bot/start";
import { actions, buttons } from "../constants/constants";
import { joinGroup } from "../../controllers/bot/join-group";
import { userPaid } from "../../controllers/bot/user-paid";

bot.on("message", async (msg) => {
  try {
    const chatId = msg.from?.id;
    const text = msg.text;
    const user = await UserModel.findOne({ chatId });

    if (user && user.status === "block" && chatId) {
      bot.sendMessage(chatId, "Siz admin tomonidan bloklangansiz!");
      return;
    }

    if (text === "/start") {
      start(msg);
    }

    if (text === buttons.joinTheGroup) {
      joinGroup(msg);
    }

    if (msg.photo && user?.action === actions.joinTheGroup) {
      userPaid(msg);
    }
  } catch (error) {
    console.error(error);
  }
});
