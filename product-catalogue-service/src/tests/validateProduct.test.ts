import { Request, Response, NextFunction } from "express";
import validateProduct from "../middleware/validateProduct";
import { isProductValid } from "../helpers/isProductValid";

jest.mock("../helpers/isProductValid");

describe("validateProduct middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: {} };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  it("should call next() if the product is valid", () => {
    (isProductValid as jest.Mock).mockReturnValue(true);

    validateProduct(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if the product is invalid", () => {
    (isProductValid as jest.Mock).mockReturnValue(false);

    validateProduct(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "Missing one or more fields. Product must contain fields: product_name and unit_weight"
    );
  });
});
