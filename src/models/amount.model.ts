import mongoose, { Schema, Document } from "mongoose";

export interface IAmount extends Document {
  value: number;
  unit: "zero" | "K" | "M" | "B";
}

const AmountSchema: Schema = new Schema({
  value: { type: Number, required: true, default: 25000 },
  unit: {
    type: String,
    enum: ["zero", "K", "M", "B"],
    default: "zero",
  },
});

AmountSchema.pre(
  "deleteOne",
  { document: true, query: false },
  function (next) {
    throw new Error("Bu yozuvni o'chirish mumkin emas.");
    next();
  }
);

AmountSchema.pre("save", async function (next) {
  const existingAmount = await AmountModel.findOne();
  if (existingAmount && this.isNew) {
    throw new Error(
      "Yangi yozuv yaratish mumkin emas. Faqat mavjud yozuvni o'zgartirish mumkin."
    );
  }
  next();
});

export const AmountModel = mongoose.model<IAmount>("Amount", AmountSchema);

export const initializeAmount = async () => {
  try {
    const existingAmount = await AmountModel.findOne();
    if (existingAmount) {
      console.log(
        "Amount modeli bo'yicha yozuv allaqachon mavjud. Yangi yozuv yaratish mumkin emas."
      );
    } else {
      // Yangi yozuv yaratish
      await AmountModel.create({ value: 25000, unit: "zero" });
      console.log("Amount modeli uchun boshlang'ich yozuv yaratildi.");
    }
  } catch (error) {
    console.error(error);
  }
};
