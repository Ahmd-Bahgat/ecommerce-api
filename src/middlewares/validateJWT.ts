import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const validateJWT = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorizationHeader = req.get("authorization");
  if (!authorizationHeader) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
  const token = authorizationHeader.split(" ")[1];
  if (!authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  jwt.verify(token, process.env.SECRET_KEY as string, async (err, payload) => {
    if (err) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    if (!payload || typeof payload === "string") {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }
    req.userId = payload.userId;
    next();
  });
};
