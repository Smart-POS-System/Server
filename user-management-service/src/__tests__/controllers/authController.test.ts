import { Request, Response, NextFunction } from "express";
import { mock, MockProxy } from "jest-mock-extended";
import AppError from "../../Utils/appError";
import { checkMail, login, logout } from "../../Controllers/authController";
import { correctPassword, isUserExist } from "../../Services/authServices";

jest.mock("../../Services/authServices", () => ({
  isUserExist: jest.fn(),
  correctPassword: jest.fn(),
  createSendToken: jest.fn().mockReturnValue("mock_token"),
}));

describe("AuthController", () => {
  let req: MockProxy<Request>;
  let res: MockProxy<Response>;
  let next: NextFunction;
  let mockError: AppError;

  beforeEach(() => {
    req = mock<Request>();
    res = mock<Response>({
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    });
    next = jest.fn();
    mockError = new AppError("Error", 400);
  });

  describe("checkMail", () => {
    it("should validate email and send user data", async () => {
      req.body = { email: "test@example.com" };
      (isUserExist as jest.Mock).mockResolvedValue({
        email: "test@example.com",
        role: "user",
      });

      await checkMail(req, res, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: {
          email: "test@example.com",
          role: "user",
        },
      });
    });

    it("should return an error if email is not provided", async () => {
      req.body = {};
      await checkMail(req, res, next);
      expect(next).toHaveBeenCalledWith(expect.any(AppError));
    });
  });

  //   describe("login", () => {
  //     it("should log the user in and return a token", async () => {
  //       req.body = { email: "user@example.com", password: "password123" };
  //       const hashedPassword = "hashedpassword123"; // Mocked hashed password
  //       (isUserExist as jest.Mock).mockResolvedValue({
  //         email: "user@example.com",
  //         password: hashedPassword,
  //         is_active: true,
  //       });
  //       (correctPassword as jest.Mock).mockResolvedValue(true); // Assuming correctPassword returns a boolean

  //       await login(req, res, next);

  //       expect(correctPassword).toHaveBeenCalledWith(
  //         "password123",
  //         hashedPassword
  //       );
  //       expect(res.status).toHaveBeenCalledWith(200);
  //       expect(res.json).toHaveBeenCalledWith({
  //         status: "success",
  //         data: {
  //           token: "mock_token",
  //         },
  //       });
  //     });
  //   });

  describe("logout", () => {
    it("should log the user out and clear the jwt cookie", () => {
      logout(req, res);
      expect(res.cookie).toHaveBeenCalledWith("jwt", "loggedout", {
        expires: expect.any(Date),
        httpOnly: true,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
      });
    });
  });
});
