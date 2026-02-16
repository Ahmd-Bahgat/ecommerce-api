import express from "express";
import asyncHandler from "../utils/asyncHandler";
import { userModel } from "../models/userModel";
import { zUserSchema } from "../validation/userValidation";
import { login, register } from "../services/userService";
import AppError from "../utils/appError";
const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const users = await userModel.find();
    if (!users.length) {
      throw new AppError("No users found", 404);
    }
    res.status(200).json({ message: "Users found", data: users });
  }),
);

router.post(
  "/register",
  asyncHandler(async (req, res, next) => {
    const parsed = zUserSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(`Invalid data`, 400);
    }

    const { statusCode, data } = await register(parsed.data);
    res.status(statusCode).json(data);
  }),
);

router.post(
  "/login",
  asyncHandler(async (req, res, next) => {
    const parsed = zUserSchema
      .pick({ email: true, password: true })
      .safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(`Invalid data`, 400);
    }
    const { email, password } = parsed.data;

    const { statusCode, data } = await login({ email, password });
    res.status(statusCode).json(data);
  }),
);

export default router;
