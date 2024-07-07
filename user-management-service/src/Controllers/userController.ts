import { NextFunction, Request, Response } from "express";
import AppDataSource from "./../index";
import { User } from "../Utils/database";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { validRoles } from "../Utils/roles";

export const isUserExists = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const { email } = req.body;
    const user = await userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      throw new Error("User already exists");
      //return res.status(400).json({ message: "User already exists" });
    }
    next();
  } catch (err: any) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

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
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "fail",
        message: errors.array()[0].msg,
        //errors: errors.array(),
      });
    }
    next();
  },
];

export const sendMailToUser = async (req: Request, res: Response) => {};

export const createUserByAdmin = async (req: Request, res: Response) => {
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
        user: newUser,
      },
    });
  } catch (err: any) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};
