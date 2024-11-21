import { Request, Response } from "express";
import { PaymentCalculationModel } from "../models/payment-calculation";
import { UserModel } from "../models/user.model";

export const getStatistics = async (req: Request, res: Response) => {
  try {
    const paymentCalculation = await PaymentCalculationModel.findOne();
    const users = await UserModel.countDocuments();
    const usersWait = await UserModel.find({ isPaid: "wait" }).countDocuments();
    const usersBlock = await UserModel.find({
      status: "block",
    }).countDocuments();

    const data = {
      sum: paymentCalculation?.sum,
      users,
      usersBlock,
      usersWait,
    };
    res.json(data);
  } catch (error) {
    console.error(error);
  }
};
