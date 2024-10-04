import { Request, Response, NextFunction } from "express";
import doesProductExist from "../middleware/doesProductExist";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
    }),
  },
}));

describe("doesProductExist middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: { product_id: "1" }, params: {} }; // Initialize req.body and params
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  it("should call next() if the product exists", async () => {
    (
      AppDataSource.getRepository(Product).findOne as jest.Mock
    ).mockResolvedValueOnce({});

    await doesProductExist(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 404 if the product does not exist", async () => {
    (
      AppDataSource.getRepository(Product).findOne as jest.Mock
    ).mockResolvedValueOnce(null);

    await doesProductExist(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith(
      "There is no product in the database with the product_id: 1"
    );
  });
});
