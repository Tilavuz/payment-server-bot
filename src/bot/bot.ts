import TelegramBot from "node-telegram-bot-api";
import { token } from "../helpers/shared";

const bot = new TelegramBot(token ?? "", { polling: true });

export default bot;

import "./events/message";
import "./events/chat_join_request";
