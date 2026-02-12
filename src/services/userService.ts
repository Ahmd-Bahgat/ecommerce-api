import { userModel } from "../models/userModel";
import { IUser } from "../validation/userValidation";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
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
  try {
    const findUser = await userModel.findOne({ email });
    if (findUser) {
      return { statusCode: 400, data: "User already exists" };
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
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

interface ILogin {
  email: string;
  password: string;
}

export const login = async ({
  email,
  password,
}: ILogin): Promise<ServiceResponse> => {
  try {
    const findUser = await userModel.findOne({ email });
    if (!findUser) {
      return { statusCode: 401, data: "Incorrect email or password" };
    }

    const isMatch = await bcrypt.compare(password, findUser.password);
    if (!isMatch) {
      return { statusCode: 401, data: "Incorrect email or password" };
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
  } catch (error) {
    console.error(error);
    throw new Error("Internal server error");
  }
};

function generateJWT(payload: {userId: string}) {
  if (!process.env.SECRET_KEY) {
    throw new Error("SECRET_KEY is not defined");
  }

  return jwt.sign(payload, process.env.SECRET_KEY, {
    expiresIn: "7d",
  });
}
