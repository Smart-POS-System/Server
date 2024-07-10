import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validRoles } from "../Utils/roles";
import { sendMail } from "../Utils/userMail";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { AppDataSource } from "../index";
import { Employee } from "../entity/Employee";

export const isUserExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(Employee);
      const { email } = req.body;
      const user = await userRepository.findOne({
        where: {
          email: email,
        },
      });
      if (user) {
        next(new AppError("User already exists", 404));
      }
      next();
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const validateUser = [
  body("name")
    .isString()
    .withMessage("User's name must be a string")
    .notEmpty()
    .withMessage("User's name is required"),
  body("role_name")
    .isIn(validRoles)
    .withMessage(
      "Role must be one of Regional Manager, Inventory Manager, Inventory Supervisor, Store Manager, Store Supervisor, Cashier"
    )
    .notEmpty()
    .withMessage("Role is required"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .notEmpty()
    .withMessage("Email is required"),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
  }),
];

export const sendMailToUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const urlForUser = `${req.protocol}://${req.get("host")}/api/v1/createUser`;
  const message = `You have been added to our POS System as a ${req.body.role_name}. Please click on the link below to set your username and password to complete your account. \n\n ${urlForUser} \n\n If you did not request this, please ignore this email.`;

  try {
    await sendMail({
      email: req.body.email,
      subject: "Complete your registration!",
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
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .notEmpty()
    .withMessage("Email is required"),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
  }),
];
