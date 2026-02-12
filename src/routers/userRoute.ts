import express from "express";
import { userModel } from "../models/userModel";
import { zUserSchema } from "../validation/userValidation";
import { login, register } from "../services/userService";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const users = await userModel.find();
    if (!users.length) {
      return res.status(404).json({ message: "No users found" });
    }
    res.status(200).json({ message: "Users found", data: users });
  } catch (error) {
    next(error);
  }
});

router.post("/register", async (req, res, next) => {
  try {
    const parsed = zUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Invalid data", error: parsed.error });
    }

    const result = await register(parsed.data);
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const result = await login({ email, password });
    res.status(result.statusCode).json(result.data);
  } catch (error) {
    next(error);
  }
});

export default router;
