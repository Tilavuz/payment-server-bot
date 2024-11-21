// src/models/Payment.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IPayment extends Document {
  chatId: string;
  amount: number;
  screenshotUrl: string;
  isApproved: boolean;
  seen: boolean;
  createdAt: Date;
}

const PaymentSchema: Schema = new Schema({
  chatId: { type: String, required: true },
  amount: { type: Number, required: true },
  screenshotUrl: { type: String, required: true },
  seen: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const PaymentModel = mongoose.model<IPayment>("Payment", PaymentSchema);
