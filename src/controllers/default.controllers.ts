import { initializeAmount } from "../models/amount.model";
import cron from "node-cron";
import { checkUserJoinDate } from "./user.controller";
import { initializePaymentCalculation } from "../models/payment-calculation";
import { initializeInviteLink } from "../models/invite-link.model";
import { initializeTelegramAdmin } from "../models/telegram-admin.model";

// Har kuni foydalanuvchilarning vaqtini tekshirish
cron.schedule("0 0 * * *", checkUserJoinDate);

initializeAmount();
initializePaymentCalculation();
initializeInviteLink();
initializeTelegramAdmin();
