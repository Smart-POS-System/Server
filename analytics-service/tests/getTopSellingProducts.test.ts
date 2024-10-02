import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "../src/data-source";
import { SalesController } from "../src/controller/SalesController";
import { Between } from "typeorm";
import { Bill } from "../src/entity/Bill";

jest.mock("../src/data-source", () => ({
  AppDataSource: {
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(),
    }),
  },
}));

describe("SalesController - getTopSellingProducts", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let salesController: SalesController;

  beforeEach(() => {
    req = {
      query: {
        startDate: "2023-10-01",
        endDate: "2023-10-31",
      },
    };
    res = {};
    next = jest.fn();
    salesController = new SalesController(); // Initialize the controller
  });

  it("should return top 4 selling products for the given date range", async () => {
    const mockBills = [
      {
        items: [
          { product_name: "Product A", quantity: 2, price: 100 },
          { product_name: "Product B", quantity: 3, price: 50 },
        ],
        timestamp: new Date("2023-10-04T10:00:00Z"),
      },
      {
        items: [
          { product_name: "Product A", quantity: 1, price: 150 },
          { product_name: "Product C", quantity: 5, price: 200 },
        ],
        timestamp: new Date("2023-10-05T12:00:00Z"),
      },
      {
        items: [
          { product_name: "Product B", quantity: 1, price: 200 },
          { product_name: "Product D", quantity: 4, price: 300 },
        ],
        timestamp: new Date("2023-10-06T15:00:00Z"),
      },
    ];

    // Mock the find method of the Bill repository
    (AppDataSource.getRepository(Bill).find as jest.Mock).mockResolvedValue(
      mockBills
    );

    const result = await salesController.getTopSellingProducts(
      req as Request,
      res as Response,
      next
    );

    // Check that the repository was called correctly
    expect(AppDataSource.getRepository(Bill).find).toHaveBeenCalledWith({
      where: {
        timestamp: Between(new Date("2023-10-01"), new Date("2023-10-31")),
      },
      order: {
        timestamp: "ASC",
      },
    });

    // Check the result with correct quantities
    expect(result).toEqual([
      { product_name: "Product C", quantity: 5 },
      { product_name: "Product B", quantity: 4 }, // 3 + 1
      { product_name: "Product D", quantity: 4 },
      { product_name: "Product A", quantity: 3 }, // 2 + 1
    ]);
  });

  it("should return an empty array if no bills exist in the given date range", async () => {
    // Mock no bills found
    (AppDataSource.getRepository(Bill).find as jest.Mock).mockResolvedValue([]);

    const result = await salesController.getTopSellingProducts(
      req as Request,
      res as Response,
      next
    );

    // Ensure find is called with correct parameters
    expect(AppDataSource.getRepository(Bill).find).toHaveBeenCalledWith({
      where: {
        timestamp: Between(new Date("2023-10-01"), new Date("2023-10-31")),
      },
      order: {
        timestamp: "ASC",
      },
    });

    // Expect an empty array
    expect(result).toEqual([]);
  });

  it("should return only top 4 products even if there are more", async () => {
    const mockBills = [
      {
        items: [
          { product_name: "Product A", quantity: 5, price: 100 },
          { product_name: "Product B", quantity: 3, price: 50 },
          { product_name: "Product C", quantity: 2, price: 200 },
        ],
        timestamp: new Date("2023-10-04T10:00:00Z"),
      },
      {
        items: [
          { product_name: "Product D", quantity: 6, price: 150 },
          { product_name: "Product E", quantity: 7, price: 300 },
        ],
        timestamp: new Date("2023-10-05T12:00:00Z"),
      },
    ];

    // Mock the find method of the Bill repository
    (AppDataSource.getRepository(Bill).find as jest.Mock).mockResolvedValue(
      mockBills
    );

    const result = await salesController.getTopSellingProducts(
      req as Request,
      res as Response,
      next
    );

    // Ensure only top 4 are returned
    expect(result.length).toBe(4);

    // Verify correct products and quantities
    expect(result).toEqual([
      { product_name: "Product E", quantity: 7 },
      { product_name: "Product D", quantity: 6 },
      { product_name: "Product A", quantity: 5 },
      { product_name: "Product B", quantity: 3 },
    ]);
  });
});
