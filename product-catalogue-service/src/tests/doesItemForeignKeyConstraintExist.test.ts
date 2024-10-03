import { Request, Response, NextFunction } from "express";
import doesItemForeignKeyConstraintExist from "../middleware/doesItemForeignKeyConstraintExist";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
    }),
  },
}));

describe("doesItemForeignKeyConstraintExist middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { body: { product: { product_id: 1 } } };
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  it("should call next() if no items are linked to the product", async () => {
    (
      AppDataSource.getRepository(Product).findOne as jest.Mock
    ).mockResolvedValueOnce({ items: [] });

    await doesItemForeignKeyConstraintExist(
      req as Request,
      res as Response,
      next
    );
    expect(next).toHaveBeenCalled();
  });

  it("should return 400 if there are items linked to the product", async () => {
    (
      AppDataSource.getRepository(Product).findOne as jest.Mock
    ).mockResolvedValueOnce({ items: [{}] });

    await doesItemForeignKeyConstraintExist(
      req as Request,
      res as Response,
      next
    );
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith(
      "There are items linked to this product. Delete the items before deleting the products..."
    );
  });
});
