import { mockDeep, MockProxy } from "jest-mock-extended";
import { AppDataSource } from "../../index";
import {
  createSendToken,
  isUserExist,
  signToken,
} from "../../Services/authServices";
import { Employee } from "../../entities/Employee";
import jwt from "jsonwebtoken";
import { Response } from "express";

jest.mock("../../index", () => ({
  AppDataSource: {
    getRepository: jest.fn(),
  },
}));

describe("isUserExist", () => {
  let mockRepository: MockProxy<any>;

  beforeEach(() => {
    mockRepository = mockDeep();
    (AppDataSource.getRepository as jest.Mock).mockReturnValue(mockRepository);
  });

  it("should return a user when the user exists", async () => {
    const mockUser = { id: 1, email: "test@example.com", name: "John Doe" };
    mockRepository.findOne.mockResolvedValue(mockUser);

    const result = await isUserExist("test@example.com");

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Employee);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
    });
    expect(result).toEqual(mockUser);
  });

  it("should return null when the user does not exist", async () => {
    mockRepository.findOne.mockResolvedValue(null);

    const result = await isUserExist("nonexistent@example.com");

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Employee);
    expect(mockRepository.findOne).toHaveBeenCalledWith({
      where: { email: "nonexistent@example.com" },
    });
    expect(result).toBeNull();
  });

  it("should handle exceptions thrown by the repository", async () => {
    const error = new Error("Database error");
    mockRepository.findOne.mockRejectedValue(error);

    await expect(isUserExist("error@example.com")).rejects.toThrow(error);
  });
});

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}));

describe("signToken", () => {
  beforeEach(() => {
    // Setup environment variables
    process.env.JWT_SECRET = "test_secret";
    process.env.JWT_EXPIRES_IN = "1h";
  });

  it("should create a JWT for a valid user", () => {
    const user = {
      employee_id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
    };
    const expectedPayload = {
      id: user.employee_id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    // Set up jwt.sign to return a specific dummy token
    (jwt.sign as jest.Mock).mockReturnValue("dummy_token");

    const token = signToken(user);

    expect(jwt.sign).toHaveBeenCalledWith(expectedPayload, "test_secret", {
      expiresIn: "1h",
    });
    expect(token).toBe("dummy_token");
  });

  it("should use environment variables for secret and expiration", () => {
    const user = {
      employee_id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Admin",
    };

    signToken(user);

    expect(jwt.sign).toHaveBeenCalledWith(
      expect.any(Object),
      process.env.JWT_SECRET,
      expect.objectContaining({
        expiresIn: process.env.JWT_EXPIRES_IN,
      })
    );
  });
});

// jest.mock("../../Services/authServices", () => ({
//   signToken: jest.fn(),
// }));

// describe("createSendToken", () => {
//   let res: MockProxy<Response>;
//   let user: any;

//   beforeEach(() => {
//     res = mockDeep<Response>();
//     res.cookie = jest.fn() as any; // Directly mock the cookie method
//     user = {
//       employee_id: 1,
//       name: "John Doe",
//       email: "john@example.com",
//       role: "Admin",
//     };

//     // Mock signToken to return a specific dummy token
//     (signToken as jest.Mock).mockReturnValue("dummy_token");
//     process.env.JWT_COOKIE_EXPIRES_IN_HOURS = "2"; // Set expiration hours for testing
//     process.env.NODE_ENV = "development"; // Default to development environment
//   });

//   it("should create a JWT, set it in cookies, and return the token", () => {
//     const token = createSendToken(user, 200, res);

//     expect(signToken).toHaveBeenCalledWith(user);
//     expect(res.cookie).toHaveBeenCalledWith("jwt", "dummy_token", {
//       expires: expect.any(Date),
//       httpOnly: true,
//       secure: undefined, // Not secure in development environment
//     });
//     expect(token).toBe("dummy_token");
//   });

//   it("should use secure cookies in production environment", () => {
//     process.env.NODE_ENV = "production"; // Simulate production environment
//     createSendToken(user, 200, res);

//     expect(res.cookie).toHaveBeenCalledWith("jwt", "dummy_token", {
//       expires: expect.any(Date),
//       httpOnly: true,
//       secure: true, // Secure must be true in production
//     });
//   });
// });
