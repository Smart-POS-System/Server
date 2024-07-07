import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { User } from "../Utils/database";
import AppDataSource from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { promisify } from "util";

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

const verifyToken = (token: string, secret: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    //Verification token
    const jwtSecret = process.env.JWT_SECRET as string;

    const decoded: any = await verifyToken(token, jwtSecret);

    //Checking whether the user still exists
    const userRepository = AppDataSource.getRepository(User);

    const currentUser = await userRepository.findOne({
      where: {
        email: decoded.email,
      },
    });

    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    // Checking whether the user changed password after the token was issued
    if (changedPasswordAfter(decoded.iat, currentUser.passwordChangedAt)) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401
        )
      );
    }

    // Granting access to the protected route
    req.user = currentUser;
    next();
  }
);

const changedPasswordAfter = function (
  JWTTimestamp: number,
  passwordChangedAt: Date | null
) {
  if (passwordChangedAt) {
    const changedTimestamp = passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  // Assuming passwordChangedAt is null
  return false;
};
