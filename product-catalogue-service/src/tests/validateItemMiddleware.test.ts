import { Request, Response, NextFunction } from "express";
import validateItem from "../middleware/validateItem";
import { isItemValid } from "../helpers/isItemValid";

jest.mock("../helpers/isItemValid");

describe("validateItem middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  it("should call next() if the item is valid", () => {
    (isItemValid as jest.Mock).mockReturnValue(true);

    validateItem(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if the item is invalid", () => {
    (isItemValid as jest.Mock).mockReturnValue(false);

    validateItem(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Missing one or more fields. Item must contain fields: product_id, buying_price, selling_price, mfd, exp, and optionally, batch_no"
    );
  });
});
