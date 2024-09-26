import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import {
  createCustomer,
  getAllCustomers,
  getOneCustomer,
} from "../Services/customerServices";
import { setFeatures } from "../Utils/features";
import catchAsync from "../Utils/catchAsync";

export const getCustomers = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const queryString = setFeatures(req.query);
      const customers = await getAllCustomers(queryString);
      if (!customers || customers.length === 0) {
        return next(new AppError("No customers found", 404));
      }

      res.status(200).json({
        status: "success",
        length: customers.length,
        data: {
          customers,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const getCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { mobile } = req.params;
      const customer = await getOneCustomer(mobile);

      if (!customer) {
        return next(new AppError("Customer not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          customer,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);

export const addCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, phone, address } = req.body;
      if (!name || !phone || !address) {
        return next(
          new AppError("Please provide name, phone and address", 400)
        );
      }
      if (phone.length !== 10 && phone[0] !== "0") {
        return next(new AppError("Please provide a valid phone number", 400));
      }

      const isCustomerExist = await getOneCustomer(phone);

      if (isCustomerExist) {
        return next(new AppError("Customer already exists", 400));
      }

      const customer = await createCustomer({ name, phone, address });

      res.status(201).json({
        status: "success",
        data: {
          customer,
        },
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);
