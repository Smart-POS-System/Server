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
    host || "localhost:3001"
  }/reset/${resetToken}`;

  const htmlMessage = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f8ff;
              color: #333;
          }
          .container {
              background-color: #ffffff;
              padding: 30px;
              border-radius: 8px;
              max-width: 600px;
              margin: 40px auto;
              box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
              border-top: 5px solid #007bff;
          }
          .header {
              text-align: center;
              margin-bottom: 30px;
          }
          .header h1 {
              margin: 0;
              color: #007bff;
              font-size: 24px;
          }
          .content {
              margin-bottom: 30px;
              color: #444;
              font-size: 16px;
              line-height: 1.6;
          }
          .content p {
              margin: 15px 0;
          }
          .reset-link {
              display: inline-block;
              padding: 12px 25px;
              background-color: #007bff;
              color: #ffffff;
              text-decoration: none;
              font-weight: bold;
              border-radius: 25px;
              box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
              transition: background-color 0.3s ease;
          }
          .reset-link:hover {
              background-color: #0056b3;
          }
          .footer {
              text-align: center;
              color: #888;
              font-size: 12px;
              margin-top: 20px;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Password Reset</h1>
          </div>
          <div class="content">
              <p>Hello,</p>
              <p>We received a request to reset your password. Click the button below to reset it:</p>
              <div style="text-align: center; margin-top: 20px;">
                  <a href="${resetURL}" class="reset-link">Reset Password</a>
              </div>
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          </div>
          <div class="footer">
              <p>This link is valid for 10 minutes.</p>
          </div>
      </div>
  </body>
  </html>`;

  await sendMail({
    email,
    subject: "Password Reset (valid for 10 minutes)",
    message: htmlMessage,
  });
};

export const updateLastLogin = async (user: any) => {
  const userRepository = AppDataSource.getRepository(Employee);
  user.last_login_at = new Date(Date.now());
  await userRepository.save(user);
};
