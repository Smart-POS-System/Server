import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { User } from "../Utils/database";
import AppDataSource from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { promisify } from "util";
import crypto from "crypto";
import { sendMail } from "../Utils/userMail";

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

const verifyToken = (token: string, secret: string): Promise<any> => {
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

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    if (!token) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }

    console.log("Token: ", token);
    // Verify token
    const jwtSecret = process.env.JWT_SECRET as string;

    try {
      const decoded: any = await verifyToken(token, jwtSecret);

      // Check if user still exists
      const userRepository = AppDataSource.getRepository(User);
      const currentUser = await userRepository.findOne({
        where: { email: decoded.email },
      });

      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            401
          )
        );
      }

      // Check if user changed password after the token was issued
      if (changedPasswordAfter(decoded.iat, currentUser.passwordChangedAt)) {
        return next(
          new AppError(
            "User recently changed password! Please log in again.",
            401
          )
        );
      }

      // Grant access to protected route
      req.user = currentUser;
      console.log("User: ", req.user);
      next();
    } catch (err) {
      return next(new AppError("Invalid token or token expired", 401));
    }
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

const isEligible = (userRole: string, role: string): boolean => {
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

export const restrictToCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user || !req.body || !req.user.role || !req.body.role) {
    return next(new AppError("Data is missing", 400));
  }

  if (!isEligible(req.user.role, req.body.role)) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  next();
};

export const restrictTo = (...roles: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError("You are not logged in! Please log in to get access.", 401)
      );
    }
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  };
};

const createPasswordResetToken = function (user: any) {
  const resetToken = crypto.randomBytes(32).toString("hex");

  user.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    const resetToken = createPasswordResetToken(user);
    await userRepository.save(user);
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendMail({
        email: req.body.email,
        subject: "Password Reset (valid for 10 minutes)",
        message,
      });

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err: any) {
      user.passwordResetToken = null;
      user.passwordResetExpires = null;
      await userRepository.save(user);

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.passwordResetToken = :hashedToken", { hashedToken })
      .andWhere("user.passwordResetExpires > :currentDate", {
        currentDate: new Date(Date.now()),
      })
      .getOne();

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    if (!req.body.password || !req.body.passwordConfirm) {
      return next(
        new AppError("Please provide password and passwordConfirm", 400)
      );
    }
    if (req.body.password.length < 8) {
      return next(
        new AppError("Password should be at least 8 characters", 400)
      );
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await userRepository.save(user);

    createSendToken(user, 200, res);
  }
);
export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "success",
  });
};
