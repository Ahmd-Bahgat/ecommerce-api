import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/appError";
dotenv.config();

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    throw new AppError("Unauthorized", 401);
  }
  const token = authorizationHeader.split(" ")[1];
  if (!authorizationHeader.startsWith("Bearer ")) {
    throw new AppError("Unauthorized", 401);
  }

  jwt.verify(token, process.env.SECRET_KEY as string, async (err, payload) => {
    if (err) {
      throw new AppError("Unauthorized", 401);
    }
    if (!payload || typeof payload === "string") {
      throw new AppError("Unauthorized", 401);
    }
    req.userId = payload.userId;
    next();
  });
};
