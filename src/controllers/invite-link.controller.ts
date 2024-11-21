import { Request, Response } from "express";
import { InviteLinkModel } from "../models/invite-link.model";

export const getInviteLink = async (req: Request, res: Response) => {
  try {
    const inviteLink = await InviteLinkModel.findOne();
    res.json(inviteLink);
  } catch (error) {
    console.error(error);
  }
};

export const changeInviteLink = async (req: Request, res: Response) => {
  try {
    const { inviteLink } = req.body;

    let oldInviteLink = await InviteLinkModel.findOne();

    if (!oldInviteLink) {
      res.status(401).json({ message: "Kanal linki mavjut emas!" });
      return;
    }
    oldInviteLink.inviteLink = inviteLink;

    await oldInviteLink.save();

    res.json({ message: "Malumot yangilandi!", inviteLink: oldInviteLink });
  } catch (error) {
    console.error(error);
  }
};
