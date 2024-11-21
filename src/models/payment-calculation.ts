import mongoose, { Schema, Document } from "mongoose";

export interface IPaymentCalculation extends Document {
  sum: number;
}

const PaymentCalculationSchema: Schema = new Schema({
  sum: {
    type: Number,
    required: true,
    default: 0,
  },
});

PaymentCalculationSchema.pre(
  "deleteOne",
  { document: true, query: false },
  function (next) {
    throw new Error("Bu yozuvni o'chirish mumkin emas.");
    next();
  }
);

PaymentCalculationSchema.pre("save", async function (next) {
  const existingPaymentCalculation = await PaymentCalculationModel.findOne();
  if (existingPaymentCalculation && this.isNew) {
    throw new Error(
      "Yangi yozuv yaratish mumkin emas. Faqat mavjud yozuvni o'zgartirish mumkin."
    );
  }
  next();
});

export const PaymentCalculationModel = mongoose.model<IPaymentCalculation>(
  "PaymentCalculation",
  PaymentCalculationSchema
);

export const initializePaymentCalculation = async () => {
  try {
    const existingPaymentCalculation = await PaymentCalculationModel.findOne();
    if (existingPaymentCalculation) {
      console.log(
        "PaymentCalculation modeli bo'yicha yozuv allaqachon mavjud. Yangi yozuv yaratish mumkin emas."
      );
    } else {
      // Yangi yozuv yaratish
      await PaymentCalculationModel.create({ sum: 0 });
      console.log(
        "PaymentCalculation modeli uchun boshlang'ich yozuv yaratildi."
      );
    }
  } catch (error) {
    console.error(error);
  }
};
