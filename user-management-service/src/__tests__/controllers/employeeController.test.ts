import { Request, Response, NextFunction } from "express";

import { mockDeep, MockProxy } from "jest-mock-extended";
import { getImageLink } from "../../Utils/getImageLink";
import { createUser, getAllUsers } from "../../Services/emplyeeServices";
import {
  createUserByAdmin,
  getUsers,
} from "../../Controllers/employeeController";
import AppError from "../../Utils/appError";
import { getCurrentUserRoleInfo } from "../../Utils/getUserInfo";
import { setFeatures } from "../../Utils/features";

jest.mock("../../Services/emplyeeServices");
jest.mock("../../Utils/appError");

describe("getUsers", () => {
  let req: MockProxy<Request>;
  let res: MockProxy<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = mockDeep<Request>();
    res = mockDeep<Response>({
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    });
    next = jest.fn();
    req.user = { id: 1, role: "General Manager" };
    req.query = {};
  });

  it("should successfully retrieve and return users", async () => {
    // Setup
    const mockUsers = [{ id: 1, name: "John Doe" }];
    (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
    (setFeatures as jest.Mock).mockReturnValue({});
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(getCurrentUserRoleInfo).toHaveBeenCalledWith(req.user);
    expect(setFeatures).toHaveBeenCalledWith(req.query);
    expect(getAllUsers).toHaveBeenCalledWith(["General Manager"], {});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: {
        users: mockUsers,
      },
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 404 if no users are found", async () => {
    // Setup
    (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
    (setFeatures as jest.Mock).mockReturnValue({});
    (getAllUsers as jest.Mock).mockResolvedValue([]);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalledWith(new AppError("No users found", 404));
  });

  it("should handle exceptions by calling next with an AppError", async () => {
    // Setup
    const error = new Error("Database failure");
    (getAllUsers as jest.Mock).mockRejectedValue(error);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(next).toHaveBeenCalledWith(new AppError(error.message, 400));
  });
});
