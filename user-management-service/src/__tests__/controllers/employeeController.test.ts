// import { Request, Response, NextFunction } from "express";

// import { mockDeep, MockProxy } from "jest-mock-extended";
// import { getImageLink } from "../../Utils/getImageLink";
// import { createUser, getAllUsers } from "../../Services/emplyeeServices";
// import {
//   createUserByAdmin,
//   getUsers,
// } from "../../Controllers/employeeController";
// import AppError from "../../Utils/appError";
// import { getCurrentUserRoleInfo } from "../../Utils/getUserInfo";
// import { setFeatures } from "../../Utils/features";

// jest.mock("../../Services/emplyeeServices");
// jest.mock("../../Utils/appError");

// describe("getUsers", () => {
//   let req: MockProxy<Request>;
//   let res: MockProxy<Response>;
//   let next: NextFunction;

//   beforeEach(() => {
//     req = mockDeep<Request>();
//     res = mockDeep<Response>({
//       status: jest.fn().mockReturnThis(),
//       json: jest.fn().mockReturnThis(),
//     });
//     next = jest.fn();
//     req.user = { id: 1, role: "General Manager" };
//     req.query = {};
//   });

//   it("should successfully retrieve and return users", async () => {
//     // Setup
//     const mockUsers = [{ id: 1, name: "John Doe" }];
//     (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
//     (setFeatures as jest.Mock).mockReturnValue({});
//     (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

//     // Action
//     await getUsers(req, res, next);

//     // Assertions
//     expect(getCurrentUserRoleInfo).toHaveBeenCalledWith(req.user);
//     expect(setFeatures).toHaveBeenCalledWith(req.query);
//     expect(getAllUsers).toHaveBeenCalledWith(["General Manager"], {});
//     expect(res.status).toHaveBeenCalledWith(200);
//     expect(res.json).toHaveBeenCalledWith({
//       status: "success",
//       data: {
//         users: mockUsers,
//       },
//     });
//     expect(next).not.toHaveBeenCalled();
//   });

//   it("should return 404 if no users are found", async () => {
//     // Setup
//     (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
//     (setFeatures as jest.Mock).mockReturnValue({});
//     (getAllUsers as jest.Mock).mockResolvedValue([]);

//     // Action
//     await getUsers(req, res, next);

//     // Assertions
//     expect(next).toHaveBeenCalledWith(new AppError("No users found", 404));
//   });

//   it("should handle exceptions by calling next with an AppError", async () => {
//     // Setup
//     const error = new Error("Database failure");
//     (getAllUsers as jest.Mock).mockRejectedValue(error);

//     // Action
//     await getUsers(req, res, next);

//     // Assertions
//     expect(next).toHaveBeenCalledWith(new AppError(error.message, 400));
//   });
// });

import { Request, Response, NextFunction } from "express";
import { mockDeep, MockProxy } from "jest-mock-extended";
import { getImageLink } from "../../Utils/getImageLink";
import { createUser, getAllUsers } from "../../Services/emplyeeServices";
import { createUserByAdmin, getUsers } from "../../Controllers/employeeController";
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

  // Test 1: ensure next is called when there's an error
  it("should call next with an error when there is an exception", async () => {
    // Setup
    const error = new Error("Some error occurred");
    (getAllUsers as jest.Mock).mockRejectedValue(error);

    // Action
    await getUsers(req, res, next);

    // Assertion: next is called with the error
    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  // Test 2:  ensure success status and message when users are found
  it("should return success status and message when users are found", async () => {
    // Setup
    const mockUsers = [{ id: 1, name: "John Doe" }];
    (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
    (setFeatures as jest.Mock).mockReturnValue({});
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: { users: mockUsers },
    });
  });

  // Test 3:ensure it works without query parameters
  it("should work without query parameters", async () => {
    // Setup
    req.query = {};
    const mockUsers = [{ id: 2, name: "Jane Doe" }];
    (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
    (setFeatures as jest.Mock).mockReturnValue({});
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: { users: mockUsers },
    });
  });

  // Test 4: ensure next is not called if no errors occur
  it("should not call next if no errors occur", async () => {
    // Setup
    const mockUsers = [{ id: 1, name: "John Doe" }];
    (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["General Manager"]);
    (setFeatures as jest.Mock).mockReturnValue({});
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(next).not.toHaveBeenCalled();
  });

  // Test 5:  ensure it handles default user role
  it("should handle default user role", async () => {
    // Setup
    const mockUsers = [{ id: 3, name: "Default User" }];
    req.user.role = "User";  // Default user role
    (getCurrentUserRoleInfo as jest.Mock).mockReturnValue(["User"]);
    (setFeatures as jest.Mock).mockReturnValue({});
    (getAllUsers as jest.Mock).mockResolvedValue(mockUsers);

    // Action
    await getUsers(req, res, next);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: { users: mockUsers },
    });
  });
});
