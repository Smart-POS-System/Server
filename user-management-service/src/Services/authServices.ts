import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
//import { AppDataSource } from "../data-source";

import { Roles } from "../enums/roles.enum";
import { sendMail } from "../Utils/userMail";
import { Employee } from "../entities/Employee";
import { AppDataSource } from "../index";

dotenv.config({ path: "../../config.env" });

export const isUserExist = async (email: string) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const user = await userRepository.findOne({
    where: { email },
  });
  return user;
};

export const signToken = (user: any): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN as string;

  const payload = {
    id: user.employee_id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });
};

export const createSendToken = (
  user: any,
  statusCode: number,
  res: Response
): any => {
  const token = signToken(user);

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

  return token;
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

export const isEligible = (userRole: any, role: any): boolean => {
  const roles1 = [
    Roles.GENERAL_MANAGER,
    Roles.REGIONAL_MANAGER,
    Roles.STORE_MANAGER,
    Roles.CASHIER,
  ];
  const roles2 = [
    Roles.GENERAL_MANAGER,
    Roles.REGIONAL_MANAGER,
    Roles.INVENTORY_MANAGER,
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

export const createPasswordResetToken = async function (user: any) {
  const userRepository = AppDataSource.getRepository(Employee);

  const resetToken = crypto.randomBytes(32).toString("hex");

  user.password_reset_token = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000);
  await userRepository.save(user);

  return resetToken;
};

export const resetToDefault = async (user: any) => {
  const userRepository = AppDataSource.getRepository(Employee);
  user.password_reset_token = null;
  user.password_reset_expires = null;
  await userRepository.save(user);
};

export const checkForUserToResetPassword = async (hashedToken: string) => {
  const userRepository = AppDataSource.getRepository(Employee);

  const user = await userRepository
    .createQueryBuilder("employee")
    .where("employee.password_reset_token = :hashedToken", { hashedToken })
    .andWhere("employee.password_reset_expires > :currentDate", {
      currentDate: new Date(Date.now()),
    })
    .getOne();

  return user;
};

export const saveNewPassword = async (user: any, password: string) => {
  const userRepository = AppDataSource.getRepository(Employee);
  const hashedPassword = await bcrypt.hash(password, 12);
  user.password = hashedPassword;
  user.password_reset_token = null;
  user.password_reset_token = null;
  user.password_changed_at = new Date();
  user.temporary = false;
  await userRepository.save(user);
};

export const sendEmailToUser = async (
  resetToken: string,
  protocol: string,
  host: string | undefined,
  email: string
) => {
  const resetURL = `${protocol}://${
    "localhost:3001" || host
  }/reset/${resetToken}`;
  const message = `Forgot your password? Go to this link and enter your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  await sendMail({
    email,
    subject: "Password Reset (valid for 10 minutes)",
    message,
  });
};

export const updateLastLogin = async (user: any) => {
  const userRepository = AppDataSource.getRepository(Employee);
  user.last_login_at = new Date(Date.now());
  await userRepository.save(user);
};
