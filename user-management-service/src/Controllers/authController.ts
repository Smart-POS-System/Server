import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import dotenv from "dotenv";
import crypto from "crypto";
import {
  changedPasswordAfter,
  checkForUserToResetPassword,
  correctPassword,
  createPasswordResetToken,
  createSendToken,
  isEligible,
  isUserExist,
  resetToDefault,
  saveNewPassword,
  sendEmailToUser,
  verifyToken,
} from "../Services/authServices";

dotenv.config({ path: "../../config.env" });

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const user = await isUserExist(email);

    if (!user || !(await correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    const token = createSendToken(user, 200, res);

    res.status(200).json({
      status: "success",
      data: {
        token,
      },
    });
  }
);

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    } else if (
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

    const jwtSecret = process.env.JWT_SECRET as string;

    try {
      const decoded: any = await verifyToken(token, jwtSecret);

      const currentUser = await isUserExist(decoded.email);
      //  console.log("Current User: ", currentUser);

      if (!currentUser) {
        return next(
          new AppError(
            "The user belonging to this token does no longer exist.",
            401
          )
        );
      }

      // Checking whether user changed password after the token was issued
      /*  if (changedPasswordAfter(decoded.iat, currentUser.password_changed_at)) {
        return next(
          new AppError(
            "User recently changed password! Please log in again.",
            401
          )
        );
      }*/

      // Grant access to protected route
      req.user = currentUser;
      next();
    } catch (err) {
      return next(new AppError("Invalid token or token expired", 401));
    }
  }
);

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

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.body || !req.user.role) {
      return next(new AppError("Data is missing", 400));
    }

    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide an email address", 400));
    }

    const user = await isUserExist(email);

    if (!user) {
      return next(new AppError("There is no user with email address.", 404));
    }

    if (!isEligible(req.user.role, user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    const resetToken = await createPasswordResetToken(user);

    try {
      await sendEmailToUser(resetToken, req.protocol, req.get("host"), email);

      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err: any) {
      resetToDefault(user);

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

    const user = await checkForUserToResetPassword(hashedToken);

    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    if (!req.body.password || !req.body.passwordConfirm) {
      return next(
        new AppError("Please provide password and confirm password", 400)
      );
    }
    if (req.body.password.length < 8) {
      return next(
        new AppError("Password should be at least 8 characters", 400)
      );
    }
    if (req.body.password !== req.body.passwordConfirm) {
      return next(
        new AppError("Password and confirm password do not match", 400)
      );
    }
    await saveNewPassword(user, req.body.password);
    const token = createSendToken(user, 200, res);
    res.status(200).json({
      status: "success",
      data: {
        token,
      },
    });
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
