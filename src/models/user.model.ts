// src/models/User.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  chatId: string;
  name: string;
  isPaid: "paid" | "not_paid" | "wait" | "deny_paid";
  endTime: Date | null;
  status: "active" | "inactive" | "block";
  action: string;
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  chatId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isPaid: {
    type: String,
    default: "not_paid",
    enum: ["paid", "not_paid", "wait", "deny_paid"],
  },
  endTime: {
    type: Date,
    default: null,
  },
  status: {
    type: String,
    default: "active",
    enum: ["active", "inactive", "block"],
  },
  action: {
    type: String,
    default: "",
  },
  createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
