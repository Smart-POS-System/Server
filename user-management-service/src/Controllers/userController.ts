import { NextFunction, Request, Response } from "express";
import AppDataSource from "..";
import { User } from "../Utils/database";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { validRoles } from "../Utils/roles";
import { sendMail } from "../Utils/userMail";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";

export const isUserExists = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
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
  body("firstName")
    .isString()
    .withMessage("First name must be a string")
    .notEmpty()
    .withMessage("First name is required"),
  body("lastName")
    .isString()
    .withMessage("Last name must be a string")
    .notEmpty()
    .withMessage("Last name is required"),
  body("role")
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
  const message = `You have been added to our POS System. Please click on the link below to set your username and password to complete your account. \n\n ${urlForUser} \n\n If you did not request this, please ignore this email.`;

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

export const createUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { firstName, lastName, email, role } = req.body;

      const userRepository = AppDataSource.getRepository(User);

      const tempUsername = `tempusername${Date.now()}${Math.floor(
        Math.random()
      )}`;

      const tempPassword = `tempPassword${Date.now()}${Math.floor(
        Math.random()
      )}`;

      const password = await bcrypt.hash(tempPassword, 12);

      const newUser = userRepository.create({
        username: tempUsername,
        password,
        email,
        role,
        firstName,
        lastName,
      });

      await userRepository.save(newUser);

      res.status(201).json({
        status: "success",
        data: {
          user: { ...newUser, password: undefined },
          message: "Send email to user to set username and password",
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const validateCreation = [
  body("username")
    .isString()
    .withMessage("Username must be a string")
    .notEmpty()
    .withMessage("Username is required"),
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

export const createUserByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password, passwordConfirm, email } = req.body;

    // Check that password and passwordConfirm are not null, are the same, and have a length greater than 8

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (password.length <= 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .andWhere("user.username LIKE :tempUsername", {
        tempUsername: "tempusername%",
      })
      .getOne();

    if (!user) {
      return next(new AppError("Please enter the correct email address", 404));
    }

    const isAlreadyTakenUsername = await userRepository.findOne({
      where: {
        username,
      },
    });

    if (isAlreadyTakenUsername) {
      return next(new AppError("Username is already taken", 400));
    }

    user.password = await bcrypt.hash(password, 12);
    user.username = username;
    user.passwordChangedAt = new Date();

    await userRepository.save(user);

    res.status(201).json({
      status: "success",
      data: {
        user: { ...user, password: undefined },
        message: "Account created successfully",
      },
    });
  }
);

export const getAllUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const users = await userRepository.find();

      const usersData = users.map(({ password, ...rest }) => rest);

      res.status(200).json({
        status: "success",
        data: {
          users: usersData,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);
