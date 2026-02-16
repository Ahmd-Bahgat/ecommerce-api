import { userModel } from "../models/userModel";
import { IUser } from "../validation/userValidation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import AppError from "../utils/appError";
dotenv.config();

interface ServiceResponse {
  statusCode: number;
  data: any;
}

export const register = async ({
  firstName,
  lastName,
  email,
  password,
}: IUser): Promise<ServiceResponse> => {
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      throw new AppError('User already exists', 400)
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new userModel({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const userId = newUser._id.toString();
    const token = generateJWT({ userId });

    return {
      statusCode: 200,
      data: {
        message: "user registered successfully",
        token,
        user: {
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
        },
      },
    };
};

interface ILogin {
  email: string;
  password: string;
}

export const login = async ({
  email,
  password,
}: ILogin): Promise<ServiceResponse> => {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      throw new AppError('Incorrect email or password', 401)
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      throw new AppError('Incorrect email or password', 401);
    }

    const userId = findUser._id.toString();
    const token = generateJWT({ userId });

    return {
      statusCode: 201,
      data: {
        message: "user login successfully",
        token,
        user: {
          email: findUser.email,
          firstName: findUser.firstName,
          lastName: findUser.lastName,
        },
      },
    };
};

function generateJWT(payload: {userId: string}) {
  if (!process.env.SECRET_KEY) {
    throw new AppError("SECRET_KEY is not defined", 500);
  }

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
}
