import { NextFunction, Request, Response } from "express";
import AppError from "../Utils/appError";
import {
  createCustomer,
  getAllCustomers,
  getOneCustomer,
} from "../Services/customerServices";
import { setFeatures } from "../Utils/features";
import catchAsync from "../Utils/catchAsync";
import { sendMail } from "../Utils/userMail";

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
      const { mobile } = req.query;

      if (!mobile) {
        return next(
          new AppError("Please provide a phone number to get customer", 400)
        );
      }
      const customer = await getOneCustomer(mobile as string); // Ensure it's treated as a string

      //const customer = await getOneCustomer(mobile);

      if (!customer) {
        return next(new AppError("Customer not found", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          name: customer.name,
          address: customer.address,
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

export const sendEmailToCustomer = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { customerData, data } = req.body;

      // Set default value for discount if undefined
      const discount = data.discount ?? 0;

      // Ensure items have the required fields
      const items = data.items.map((item: any) => ({
        ...item,
        unitPrice: item.price ?? 0, // Default unitPrice if undefined
        totalPrice: (item.price ?? 0) * (item.quantity ?? 1), // Compute totalPrice
      }));

      // Compose the email message
      await sendMail({
        email: customerData.address,
        subject: "Your Bill from Smart POS",
        message: `<!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>E-Bill</title>
                   <style>
                body {
                    font-family: 'Arial', sans-serif;
                    margin: 0;
                    background-color: #f4f8ff;
                    color: #333;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    max-width: 600px;
                    margin: 20px auto;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    margin-bottom: 20px;
                }
                .header h1 {
                    margin: 0;
                    color: #007bff;
                }
                .header p {
                    margin: 5px 0;
                    color: #666;
                    font-size: 14px;
                }
                .bill-info, .customer-info, .total-section {
                    margin-bottom: 20px;
                }
                .bill-info h2, .customer-info h2 {
                    font-size: 16px;
                    margin-bottom: 10px;
                    color: #007bff;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                table, th, td {
                    border: 1px solid #ddd;
                }
                th, td {
                    padding: 12px;
                    text-align: left;
                }
                th {
                    background-color: #e7f1ff;
                    color: #007bff;
                }
                .total-section {
                    text-align: right;
                    font-size: 16px;
                }
                .total-section h3 {
                    margin: 0;
                    color: #333;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    color: #888;
                    font-size: 12px;
                }
                @media (max-width: 600px) {
                    .header h1 {
                        font-size: 24px;
                    }
                    .bill-info h2, .customer-info h2 {
                        font-size: 14px;
                    }
                    th, td {
                        padding: 8px;
                    }
                    .total-section h3 {
                        font-size: 14px;
                    }
                    .footer {
                        font-size: 10px;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Smart POS</h1>
                    <p>Address: 123 Business St., City, Country</p>
                    <p>Email: info@company.com | Phone: +1234567890</p>
                </div>
        
                <div class="bill-info">
                    <h2>Bill Details</h2>
                    <p><strong>Bill Number:</strong> #123456</p>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    <p><strong>Payment Method:</strong> ${
                      data.paymentmethod
                    }</p>
                </div>
        
                <div class="customer-info">
                    <h2>Customer Details</h2>
                    <p><strong>Name:</strong> ${customerData.name}</p>
                    <p><strong>Email:</strong> ${customerData.address}</p>
                </div>
        
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Quantity</th>
                            <th>Unit Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${items
                          .map(
                            (item: any) => `
                            <tr>
                              <td>${item.name}</td>
                              <td>${item.quantity}</td>
                              <td>$${item.unitPrice.toFixed(2)}</td>
                              <td>$${item.totalPrice.toFixed(2)}</td>
                            </tr>`
                          )
                          .join("")}
                    </tbody>
                </table>
        
                <div class="total-section">
                    <h3>Subtotal: $${items
                      .reduce(
                        (acc: number, item: any) => acc + item.totalPrice,
                        0
                      )
                      .toFixed(2)}</h3>
                    <h3>Discount: $${discount.toFixed(2)}</h3>
                   
                    <h3><strong>Total: $${(
                      items.reduce(
                        (acc: number, item: any) => acc + item.totalPrice,
                        0
                      ) - discount
                    ).toFixed(2)}</strong></h3>
                </div>
        
                <div class="footer">
                    <p>Thank you for your purchase!</p>
                    <p>If you have any questions, feel free to contact us at info@company.com.</p>
                </div>
            </div>
        </body>
        </html>`,
      });

      // Send a success response
      res.status(201).json({
        status: "success",
        msg: "sent bill",
      });
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);
