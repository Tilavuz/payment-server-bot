import mongoose, { Schema, Document } from "mongoose";

export interface ITelegramAdmin extends Document {
  value: string;
}

const TelegramAdminSchema: Schema = new Schema({
  value: {
    type: String,
    default: "",
  },
});

TelegramAdminSchema.pre(
  "deleteOne",
  { document: true, query: false },
  function (next) {
    throw new Error("Bu yozuvni o'chirish mumkin emas.");
    next();
  }
);

TelegramAdminSchema.pre("save", async function (next) {
  const existingTelegramAdmin = await TelegramAdminModel.findOne();
  if (existingTelegramAdmin && this.isNew) {
    throw new Error(
      "Yangi yozuv yaratish mumkin emas. Faqat mavjud yozuvni o'zgartirish mumkin."
    );
  }
  next();
});

export const TelegramAdminModel = mongoose.model<ITelegramAdmin>(
  "TelegramAdmin",
  TelegramAdminSchema
);

export const initializeTelegramAdmin = async () => {
  try {
    const existingTelegramAdmin = await TelegramAdminModel.findOne();
    if (existingTelegramAdmin) {
      console.log(
        "TelegramAdmin modeli bo'yicha yozuv allaqachon mavjud. Yangi yozuv yaratish mumkin emas."
      );
    } else {
      // Yangi yozuv yaratish
      await TelegramAdminModel.create({ value: "" });
      console.log("TelegramAdmin modeli uchun boshlang'ich yozuv yaratildi.");
    }
  } catch (error) {
    console.error(error);
  }
};
