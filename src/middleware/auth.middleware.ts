import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { jwtKey } from "../helpers/shared";

const auth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token; // Retrieve token from cookies

  if (!token) {
    res.status(401).json({ message: "Saytga qayta kiring!" });
    return;
  }

  if (!jwtKey) {
    res.status(500).json({ message: "JWT key is not defined" });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtKey);
    (req as any).auth = decoded;
    next(); // Proceed to the next middleware or route
  } catch (err) {
    res.status(400).json({ message: "Yaroqsiz foydalanuvchi", status: false });
    return;
  }
};

export { auth };
