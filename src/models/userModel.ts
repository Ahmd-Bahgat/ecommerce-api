import mongoose from "mongoose";
import { IUser } from "../validation/userValidation";

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export const userModel = mongoose.model<IUser>("User", userSchema);
