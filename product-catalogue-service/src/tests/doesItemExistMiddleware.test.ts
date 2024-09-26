import { Request, Response, NextFunction } from "express";
import doesItemExist from "../middleware/doesItemExist";
import { AppDataSource } from "../data-source";
import { Item } from "../entities/Item";

jest.mock("../data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(),
    }),
  },
}));

describe("doesItemExist middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { params: { item_id: "1" }, body: {} }; // Initialize req.body
    res = { status: jest.fn().mockReturnThis(), send: jest.fn() };
    next = jest.fn();
  });

  it("should call next() if the item exists", async () => {
    (
      AppDataSource.getRepository(Item).findOne as jest.Mock
    ).mockResolvedValueOnce({});

    await doesItemExist(req as Request, res as Response, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 404 if the item does not exist", async () => {
    (
      AppDataSource.getRepository(Item).findOne as jest.Mock
    ).mockResolvedValueOnce(null);

    await doesItemExist(req as Request, res as Response, next);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalledWith("There is no item with item_id 1");
  });
});
