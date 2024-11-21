import jwt from "jsonwebtoken";
import { jwtKey } from "./shared";

export const generateToken = ({ _id }: { _id: string }) => {
  try {
    if (!jwtKey) {
      throw new Error("JWT kaliti mavjud emas.");
    }
    const token = jwt.sign({ _id }, jwtKey, { expiresIn: "7d" });
    return token;
  } catch (error) {
    console.error(error);
  }
};
