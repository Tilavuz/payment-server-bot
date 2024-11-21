import mongoose, { Schema, Document } from "mongoose";

export interface IAuth extends Document {
  username: string;
  password: string;
}

const AuthSchema: Schema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
});

export const AuthModel = mongoose.model<IAuth>("Auth", AuthSchema);
