import { NextFunction, Request, Response } from "express";
import { User } from "../Utils/database";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import { validRoles } from "../Utils/roles";
import { sendMail } from "../Utils/userMail";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { AppDataSource } from "./../index";
import { Employee } from "../entity/Employee";
import { Role } from "../entity/Role";
import {
  lowerRole1,
  lowerRole2,
  roleHierarchy1,
  roleHierarchy2,
  roleHierarchy3,
} from "../Utils/roleHierarchy";

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

export const createUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, role_name } = req.body;

      const userRepository = AppDataSource.getRepository(Employee);
      const roleRepository = AppDataSource.getRepository(Role);

      const role = await roleRepository.findOneBy({ role_name });

      if (!role) {
        return next(new AppError("Role not found", 400));
      }

      const tempPassword = `tempPassword${Date.now()}${Math.floor(
        Math.random() * 10000
      )}`;
      const hashedPassword = await bcrypt.hash(tempPassword, 12);

      const newUser = userRepository.create({
        employee_name: name,
        email,
        password: hashedPassword,
        role,
        temporary: true,
        is_active: false,
      });

      await userRepository.save(newUser);

      res.status(201).json({
        status: "success",
        data: {
          user: { ...newUser, password: undefined },
          message: "Sent email to user to set username and password",
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

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

export const createUserByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, passwordConfirm, email } = req.body;

    if (password.startsWith("tempPassword")) {
      return next(new AppError("Please set another word as the password", 400));
    }

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (password.length <= 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const userRepository = AppDataSource.getRepository(Employee);

    const user = await userRepository
      .createQueryBuilder("user")
      .where("user.email = :email", { email })
      .andWhere("user.temporary = true")
      .getOne();

    if (!user) {
      return next(new AppError("Please enter the correct email address", 404));
    }

    user.password = await bcrypt.hash(password, 12);
    user.temporary = false;
    user.is_active = true;
    user.password_changed_at = new Date();

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

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(Employee);

      const allowedRoles = getCurrentUserRoleInfo(req);

      const users = await userRepository
        .createQueryBuilder("employee")
        .leftJoinAndSelect("employee.role", "role")
        .where("role.role_name IN (:...allowedRoles)", { allowedRoles })
        .select(["employee.employee_name", "employee.email", "role.role_name"])
        .getMany();

      res.status(200).json({
        status: "success",
        length: users.length,
        data: {
          users,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const getOneUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userRepository = AppDataSource.getRepository(Employee);

      const allowedRoles = getCurrentUserRoleInfo(req);
      let query = userRepository
        .createQueryBuilder("employee")
        .leftJoinAndSelect("employee.role", "role")
        .where("role.role_name IN (:...allowedRoles)", { allowedRoles })
        .select(["employee.employee_name", "employee.email", "role.role_name"]);

      if (req.params.id) {
        query = query.andWhere("employee.employee_id = :employee_id", {
          employee_id: req.params.id,
        });
      } else {
        return next(new AppError("User not found", 400));
      }

      const user = await query.getOne();

      if (!user) {
        return next(
          new AppError("You don't have access or user not found", 404)
        );
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

const getCurrentUserRoleInfo = (req: Request) => {
  if (!req.user || !req.user.role || !req.user.role.role_name) {
    throw new Error("There is a problem with the logged-in user");
  }

  const currentUserRole = req.user.role.role_name;

  let roleHierarchy: { [key: string]: number };

  if (lowerRole1.includes(currentUserRole)) {
    roleHierarchy = roleHierarchy2;
  } else if (lowerRole2.includes(currentUserRole)) {
    roleHierarchy = roleHierarchy3;
  } else {
    roleHierarchy = roleHierarchy1;
  }

  const currentUserRoleLevel = roleHierarchy[currentUserRole];
  const allowedRoles = Object.entries(roleHierarchy)
    .filter(([_, level]) => level >= currentUserRoleLevel)
    .map(([role]) => role);

  return allowedRoles;
};
