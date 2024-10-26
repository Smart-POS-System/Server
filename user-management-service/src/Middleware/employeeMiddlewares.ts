import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { validRoles } from "../Utils/roles";
import { sendMail } from "../Utils/userMail";
import AppError from "../Utils/appError";
import catchAsync from "../Utils/catchAsync";
import { isUserExist } from "../Services/authServices";

export const validateUser = [
  body("name")
    .notEmpty()
    .withMessage("User's name is required")
    .isString()
    .withMessage("User's name must be a string"),
  body("role")
    .isIn(validRoles)
    .withMessage(
      "Role must be one of Regional Manager, Inventory Manager, Store Manager, Cashier"
    )
    .notEmpty()
    .withMessage("Role is required"),
  body("email")
    .isEmail()
    .withMessage("Email must be a valid email address")
    .notEmpty()
    .withMessage("Email is required"),
  body("phone")
    .isString()
    .withMessage("Phone number must be a string of 10 digits")
    .matches(/^\d{10}$/)
    .withMessage("Phone number must be a string of 10 digits")
    .notEmpty()
    .withMessage("Phone number is required"),
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new AppError(errors.array()[0].msg, 400));
    }
    next();
  }),
];

// export const validateUser = catchAsync(async (req, res, next) => {
//   const { name, role, email, phone } = req.body;
//   const validRoles = [
//     "Regional Manager",
//     "Inventory Manager",
//     "Store Manager",
//     "Cashier",
//   ];
//   let errors = [];

//   if (!name || typeof name !== "string") {
//     errors.push("User's name is required and must be a string");
//   }

//   if (!role || !validRoles.includes(role)) {
//     errors.push(
//       "Role must be one of Regional Manager, Inventory Manager, Store Manager, Cashier"
//     );
//   }

//   if (!email || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
//     errors.push("Email must be a valid email address");
//   }

//   if (!phone || !/^\d{10}$/.test(phone)) {
//     errors.push("Phone number must be a string of 10 digits");
//   }

//   if (errors.length > 0) {
//     return next(new AppError(errors.join(", "), 400));
//   }
//   next();
// });

// export const isUserExists = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = await isUserExist(req.body.email);
//       if (user) {
//         next(new AppError("User already exists", 404));
//       }
//       next();
//     } catch (err: any) {
//       return next(new AppError(err.message, 400));
//     }
//   }
// );

export const sendMailToUser = async (email: string, role: string) => {
  console.log("Sending email to: ", email);
  const defaultPassword = `POS${email}`;
  const htmlMessage = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to the POS System</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f8ff;
              color: #333;
              margin: 0;
              padding: 0;
          }
          .container {
              max-width: 600px;
              margin: 40px auto;
              padding: 30px;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
              border-top: 5px solid #28a745;
          }
          .header {
              text-align: center;
              margin-bottom: 30px;
          }
          .header h1 {
              color: #28a745;
              margin: 0;
              font-size: 24px;
          }
          .content {
              font-size: 16px;
              line-height: 1.6;
              color: #555;
          }
          .content p {
              margin: 10px 0;
          }
          .password {
              display: block;
              margin: 20px 0;
              padding: 10px 15px;
              background-color: #f9f9f9;
              border-left: 4px solid #007bff;
              font-weight: bold;
              font-size: 16px;
              color: #333;
          }
          .footer {
              margin-top: 30px;
              text-align: center;
              font-size: 12px;
              color: #888;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Welcome to the POS System!</h1>
          </div>
          <div class="content">
              <p>Hello,</p>
              <p>You have been added to our POS System with the role of <strong>${role}</strong>.</p>
              <p>Your default password is:</p>
              <div class="password">${defaultPassword}</div>
              <p><strong>Please make sure to update this default password once you log in for security purposes.</strong></p>
              <p>If you did not request this, please ignore this email.</p>
          </div>
          <div class="footer">
              <p>This email was sent by our automated system.</p>
          </div>
      </div>
  </body>
  </html>`;

  try {
    await sendMail({
      email: email,
      subject: "You have been added to our Smart Point of Sale System",
      message: htmlMessage,
    });
    return true;
  } catch (err: any) {
    return false;
  }
};

// export const validateCreation = [
//   body("currentPassword")
//     .isString()
//     .withMessage("Password must be a string")
//     .notEmpty()
//     .withMessage("Current Password is required"),
//   body("password")
//     .isString()
//     .withMessage("Password must be a string")
//     .notEmpty()
//     .withMessage("Password is required"),
//   body("passwordConfirm")
//     .isString()
//     .withMessage("Password Confirmation must be a string")
//     .notEmpty()
//     .withMessage("Password Confirmation is required"),
//   /* body("email")
//     .isEmail()
//     .withMessage("Email must be a valid email address")
//     .notEmpty()
//     .withMessage("Email is required"),*/
//   catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return next(new AppError(errors.array()[0].msg, 400));
//     }
//     next();
//   }),
// ];

export const validateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      if (!req.user || parseInt(id) !== req.user.employee_id) {
        return next(
          new AppError("You are not authorized to perform this action", 403)
        );
      }

      req.body.role = req.user.role;
      next();
    } catch (err: any) {
      return next(new AppError(err.message, 400));
    }
  }
);
