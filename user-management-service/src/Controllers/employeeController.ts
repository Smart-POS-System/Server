import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { AppDataSource } from "../index";
import { Employee } from "../entity/Employee";
import { Role } from "../entity/Role";
import { getCurrentUserRoleInfo } from "../Services/emplyeeServices";

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

/*export const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, role_name, password, passwordConfirm, email } = req.body;

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
    const roleRepository = AppDataSource.getRepository(Role);

    const role = await roleRepository.findOneBy({ role_name });

    if (!role) {
      return next(new AppError("Role not found", 400));
    }

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
); */
