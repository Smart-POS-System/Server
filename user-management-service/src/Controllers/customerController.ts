import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import { getAllCustomers, getOneCustomer } from "../Services/customerServices";
import { setFeatures } from "../Utils/features";

export const getCustomers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

export const getCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};
