import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { User } from "../Utils/database";
import AppDataSource from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config({ path: "../../config.env" });

const signToken = (email: string): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

  return jwt.sign({ email }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user.email);
  const jwtCookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN);

  const cookieOptions: { expires: Date; httpOnly: boolean; secure?: boolean } =
    {
      expires: new Date(Date.now() + jwtCookieExpiresIn * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user: { ...user, password: undefined },
    },
  });
};

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email,
      },
    });

    if (!user || !(await correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    // If everything ok, send token to client
    createSendToken(user, 200, res);
  }
);

export const correctPassword = async function (
  candidatePassword: any,
  userPassword: any
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
