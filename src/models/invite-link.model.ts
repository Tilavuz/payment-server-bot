import mongoose, { Schema, Document } from "mongoose";

export interface IInviteLink extends Document {
  inviteLink: string;
}

const InviteLinkSchema: Schema = new Schema({
  inviteLink: {
    type: String,
    default: "",
  },
});

InviteLinkSchema.pre(
  "deleteOne",
  { document: true, query: false },
  function (next) {
    throw new Error("Bu yozuvni o'chirish mumkin emas.");
    next();
  }
);

InviteLinkSchema.pre("save", async function (next) {
  const existingInviteLink = await InviteLinkModel.findOne();
  if (existingInviteLink && this.isNew) {
    throw new Error(
      "Yangi yozuv yaratish mumkin emas. Faqat mavjud yozuvni o'zgartirish mumkin."
    );
  }
  next();
});

export const InviteLinkModel = mongoose.model<IInviteLink>(
  "InviteLink",
  InviteLinkSchema
);

export const initializeInviteLink = async () => {
  try {
    const existingInviteLink = await InviteLinkModel.findOne();
    if (existingInviteLink) {
      console.log(
        "InviteLink modeli bo'yicha yozuv allaqachon mavjud. Yangi yozuv yaratish mumkin emas."
      );
    } else {
      // Yangi yozuv yaratish
      await InviteLinkModel.create({ inviteLink: "" });
      console.log("InviteLink modeli uchun boshlang'ich yozuv yaratildi.");
    }
  } catch (error) {
    console.error(error);
  }
};
