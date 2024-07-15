import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { Employee } from "../entity/Employee";
import {
  createUser,
  deleteOneUser,
  getAllUsers,
  getOneUser,
  getUserByEmailAndCurrentPassword,
  updateOneUser,
  updateUserPassword,
} from "../Services/emplyeeServices";
import { getCurrentUserRoleInfo } from "../Utils/getUserInfo";

export const createUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, role } = req.body;
      const user = await createUser(name, email, role);

      res.status(201).json({
        status: "success",
        data: {
          user: { ...user, password: undefined },
          message: "Sent email to user to set username and password",
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const updatePasswordByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, password, passwordConfirm } = req.body;

    if (!req.user || !req.user.email) {
      return next(new AppError("Couldn't authenticate the user", 404));
    }

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (password.length < 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const user = await getUserByEmailAndCurrentPassword(
      req.user.email,
      currentPassword
    );

    if (!user) {
      return next(new AppError("User is not found", 404));
    }

    const updatedUser = await updateUserPassword(user, password);

    res.status(201).json({
      status: "success",
      data: {
        user: { ...updatedUser, password: undefined },
        message: "Account created successfully",
      },
    });
  }
);

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allowedRoles = getCurrentUserRoleInfo(req.user);

      const users = await getAllUsers(allowedRoles);

      if (!users || users.length === 0) {
        return next(new AppError("No users found", 404));
      }

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

export const getUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const allowedRoles = getCurrentUserRoleInfo(req.user);

      const user = await getOneUser(parseInt(id), allowedRoles);

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

export const updateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, email, role } = req.body;
      const allowedRoles = getCurrentUserRoleInfo(req.user);

      const user = await updateOneUser(parseInt(id), allowedRoles, {
        name,
        email,
        role,
      });

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

export const deleteUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const status = await deleteOneUser(parseInt(id));

      if (!status) {
        return next(
          new AppError("You don't have access or user not found", 404)
        );
      }

      res.status(200).json({
        status: "success",
        message: "User account deactivated successfully",
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

/*export const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, role, password, passwordConfirm, email } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (password.length <= 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const userRepository = AppDataSource.getRepository(Employee);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = userRepository.create({
      employee_name: name,
      email,
      password: hashedPassword,
      role,
      temporary: false,
      is_active: true,
    });

    await userRepository.save(newUser);

    res.status(201).json({
      status: "success",
      data: {
        user: { ...newUser, password: undefined },
        message: "Account created successfully",
      },
    });
  }
);*/
