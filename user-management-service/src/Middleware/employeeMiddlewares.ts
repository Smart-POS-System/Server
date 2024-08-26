import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validRoles } from "../Utils/roles";
import { sendMail } from "../Utils/userMail";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { isUserExist } from "../Services/authServices";

export const validateUser = [
  body("name")
    .notEmpty()
    .withMessage("User's name is required")
    .isString()
    .withMessage("User's name must be a string"),
  body("role")
    .isIn(validRoles)
    .withMessage(
      "Role must be one of Regional Manager, Inventory Manager, Store Manager, Cashier"
    )
    .notEmpty()
    .withMessage("Role is required"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .notEmpty()
    .withMessage("Email is required"),
  body("phone")
    .isString()
    .withMessage("Phone number must be a string of 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be a string of 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
  }),
];

export const isUserExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await isUserExist(req.body.email);
      if (user) {
        next(new AppError("User already exists", 404));
      }
      next();
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const sendMailToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const defaultPassword = `POS${req.body.email}`;
  const message = `You have been added to our POS System as a ${req.body.role}. Your default password is ${defaultPassword}. MAKE SURE TO UPDATE THIS DEFAULT PASSWORD ONCE YOU LOGGED IN. If you did not request this, please ignore this email.`;

  try {
    await sendMail({
      email: req.body.email,
      subject: "Congratulations! You have been added to our POS System",
      message,
    });
  } catch (err: any) {
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
  next();
};

export const validateCreation = [
  body("currentPassword")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Current Password is required"),
  body("password")
    .isString()
    .withMessage("Password must be a string")
    .notEmpty()
    .withMessage("Password is required"),
  body("passwordConfirm")
    .isString()
    .withMessage("Password Confirmation must be a string")
    .notEmpty()
    .withMessage("Password Confirmation is required"),
  /* body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .notEmpty()
    .withMessage("Email is required"),*/
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
  }),
];

export const validateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!req.user || parseInt(id) !== req.user.employee_id) {
        return next(
          new AppError("You are not authorized to perform this action", 403)
        );
      }

      req.body.role = req.user.role;
      next();
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);
