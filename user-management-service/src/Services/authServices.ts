import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { promisify } from "util";
import crypto from "crypto";

dotenv.config({ path: "../../config.env" });

export const signToken = (email: string): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

  return jwt.sign({ email }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
): void => {
  const token = signToken(user.email);

  const jwtCookieExpiresIn = Number(process.env.JWT_COOKIE_EXPIRES_IN_HOURS);

  const cookieOptions: { expires: Date; httpOnly: boolean; secure?: boolean } =
    {
      expires: new Date(Date.now() + jwtCookieExpiresIn * 3600 * 1000),
      httpOnly: true,
    };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  res.cookie("jwt", token, cookieOptions);

  res.status(statusCode).json({
    status: "success",
    data: {
      //  token,
      user: { ...user, password: undefined },
    },
  });
};

export const correctPassword = async function (
  candidatePassword: any,
  userPassword: any
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

export const verifyToken = (token: string, secret: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secret, (err: any | null, decoded: any) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};

export const changedPasswordAfter = function (
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

export const isEligible = (userRole: string, role: string): boolean => {
  const roles1 = [
    "General Manager",
    "Regional Manager",
    "Store Manager",
    "Store Supervisor",
    "Cashier",
  ];
  const roles2 = [
    "General Manager",
    "Regional Manager",
    "Inventory Manager",
    "Inventory Supervisor",
  ];

  const roles =
    roles1.includes(userRole) && roles1.includes(role)
      ? roles1
      : roles2.includes(userRole) && roles2.includes(role)
      ? roles2
      : null;

  if (roles === null) {
    return false;
  }

  const userRoleIndex = roles.indexOf(userRole);
  const roleIndex = roles.indexOf(role);

  if (userRoleIndex < 0 || roleIndex < 0) {
    return false;
  }
  return userRoleIndex < roleIndex;
};

export const createPasswordResetToken = function (user: any) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.password_reset_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};
