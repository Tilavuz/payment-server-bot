import { Request, Response } from "express";
import { AmountModel } from "../models/amount.model";

export const getAmount = async (req: Request, res: Response) => {
  try {
    const amount = await AmountModel.findOne();
    res.json(amount);
  } catch (error) {
    console.error(error);
  }
};

export const changeAmount = async (req: Request, res: Response) => {
  try {
    const { value } = req.body;
    let amount = await AmountModel.findOne();

    if (!amount) {
      res.json({ message: "Malumot topilmadi!" });
      return;
    }
    amount.value = value;
    await amount.save();

    res.json({ message: "Malumot yangilandi!", amount });
  } catch (error) {
    console.error(error);
  }
};
