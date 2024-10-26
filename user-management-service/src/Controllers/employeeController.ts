import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import {
  activateOneUser,
  createUser,
  deleteOneUser,
  getAllUsers,
  getAllUsersForApp,
  getOneUser,
  getUserByEmailAndCurrentPassword,
  updateMe,
  updateOneUser,
  updateUserPassword,
} from "../Services/emplyeeServices";
import { getCurrentUserRoleInfo } from "../Utils/getUserInfo";
import { setFeatures } from "../Utils/features";
import { getImageLink } from "../Utils/getImageLink";
import { AppDataSource } from "..";
import { Employee } from "../entities/Employee";
import bcrypt from "bcryptjs";
import { Roles } from "../enums/roles.enum";
import { isEligible, isUserExist } from "../Services/authServices";
import { sendMailToUser } from "../Middleware/employeeMiddlewares";

export const createUserByAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user || !req.body || !req.user.role || !req.body.role) {
        return next(new AppError("Data is missing", 400));
      }

      if (!isEligible(req.user.role, req.body.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }

      const { name, email, role, phone } = req.body;

      if (!name) {
        return next(
          new AppError("User's name is required and must be a string", 400)
        );
      }

      if (!role || !Object.values(Roles).includes(role)) {
        return next(
          new AppError(
            "Role must be one of Regional Manager, Inventory Manager, Store Manager, Cashier",
            400
          )
        );
      }

      if (
        !email ||
        !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
      ) {
        return next(new AppError("Email must be a valid email address", 400));
      }

      if (!phone || !/^\d{10}$/.test(phone)) {
        return next(
          new AppError("Phone number must be a string of 10 digits", 400)
        );
      }

      const existingUser = await isUserExist(req.body.email);
      if (existingUser) {
        next(new AppError("User already exists", 404));
      }

      let imageLink = null;
      if (req.file || req.body.image) {
        imageLink = await getImageLink(req);
        if (!imageLink) {
          return next(new AppError("Couldn't upload image", 400));
        }
      }

      const user = await createUser(
        name,
        email,
        role,
        phone,
        imageLink || null
      );

      if (!user) {
        return next(new AppError("Couldn't create user", 400));
      }

      const status = await sendMailToUser(user.email, user.role);

      if (!status) {
        return next(
          new AppError(
            "There was an error sending the email. Try again later!",
            500
          )
        );
      }

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

export const getUsers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allowedRoles = getCurrentUserRoleInfo(req.user);
      const queryString = setFeatures(req.query);

      const { users, totalRecords } = await getAllUsers(
        allowedRoles,
        queryString
      );

      if (!users || users.length === 0) {
        return next(new AppError("No users found", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          users,
          totalRecords,
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
      const { name, email, role, phone } = req.body;
      const allowedRoles = getCurrentUserRoleInfo(req.user);

      const userParams = {
        name,
        email,
        role,
        mobile: phone,
      };

      const user = await updateOneUser(parseInt(id), allowedRoles, userParams);

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

export const updateImage = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const allowedRoles = getCurrentUserRoleInfo(req.user);
      let imageLink = null;

      if (req.file || req.body.image) {
        imageLink = await getImageLink(req);
        if (!imageLink) {
          return next(new AppError("Couldn't upload image", 400));
        }
      }

      const userParams = {
        image: imageLink,
      };

      const user = await updateOneUser(parseInt(id), allowedRoles, userParams);

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

export const activateUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const status = await activateOneUser(parseInt(id));

      if (!status) {
        return next(
          new AppError("You don't have access or user not found", 404)
        );
      }

      res.status(200).json({
        status: "success",
        message: "User account activated successfully",
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const updateLoggedUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, email, phone } = req.body;
      let imageLink = null;
      if (req.file || req.body.image) {
        imageLink = await getImageLink(req);
        if (!imageLink) {
          return next(new AppError("Couldn't upload image", 400));
        }
      }

      const user = await updateMe(parseInt(id), {
        name,
        email,
        mobile: phone,
        ...(imageLink && { image: imageLink }),
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

export const updatePasswordByUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    if (!req.user || !req.user.email) {
      return next(new AppError("Couldn't authenticate the user", 404));
    }

    if (!currentPassword || !password || !passwordConfirm) {
      return next(
        new AppError(
          "Please provide current password, new password and confirm password",
          400
        )
      );
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
      return next(new AppError("Check your current password again", 404));
    }

    const updatedUser = await updateUserPassword(user, password);

    res.status(201).json({
      status: "success",
      data: {
        user: { ...updatedUser, password: undefined },
        message: "Password updated successfully",
      },
    });
  }
);

export const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, role, password, passwordConfirm, email, mobile } = req.body;

    if (password !== passwordConfirm) {
      return next(new AppError("Passwords do not match", 400));
    }

    if (password.length <= 8) {
      return next(new AppError("Password must be at least 8 characters", 400));
    }

    const userRepository = AppDataSource.getRepository(Employee);

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = userRepository.create({
      name,
      email,
      password: hashedPassword,
      role,
      temporary: false,
      is_active: true,
      mobile,
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
);

export const getUsersForApp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const allowedRoles = getCurrentUserRoleInfo(req.user);

      const users = await getAllUsersForApp(allowedRoles);

      if (!users || users.length === 0) {
        return next(new AppError("No users found", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          users,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);
