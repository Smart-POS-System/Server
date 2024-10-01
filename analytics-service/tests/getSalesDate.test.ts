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

describe("SalesController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let salesController: SalesController;

  beforeEach(() => {
    req = {
      body: {
        startDate: "2023-10-01",
        endDate: "2023-10-31",
      },
    };
    res = {}; // Not needed for these tests
    next = jest.fn();
    salesController = new SalesController(); // Initialize your SalesController
  });

  it("should return sales data for given date range", async () => {
    const mockBills = [
      {
        items: [
          { price: 100, quantity: 2 }, // Total = 200
          { price: 50, quantity: 1 }, // Total = 50
        ],
        timestamp: new Date("2023-10-04T10:00:00Z"),
      },
      {
        items: [
          { price: 150, quantity: 1 }, // Total = 150
        ],
        timestamp: new Date("2023-10-04T12:00:00Z"),
      },
      {
        items: [
          { price: 200, quantity: 3 }, // Total = 600
        ],
        timestamp: new Date("2023-10-06T15:00:00Z"),
      },
    ];

    // Mock the find method of the Bill repository
    (AppDataSource.getRepository(Bill).find as jest.Mock).mockResolvedValue(
      mockBills
    );

    const result = await salesController.getTotalSalesData(
      req as Request,
      res as Response,
      next
    );

    expect(AppDataSource.getRepository).toHaveBeenCalledWith(Bill); // Check repository was called with Bill entity
    expect(AppDataSource.getRepository(Bill).find).toHaveBeenCalledWith({
      where: {
        timestamp: Between(new Date("2023-10-01"), new Date("2023-10-31")),
      },
    });

    expect(result).toEqual([
      { date: "2023-10-04", amount: 400 }, // 250 + 150
      { date: "2023-10-06", amount: 600 },
    ]);
  });

  it("should return an empty array if no bills exist in the given date range", async () => {
    (AppDataSource.getRepository(Bill).find as jest.Mock).mockResolvedValue([]);

    const result = await salesController.getTotalSalesData(
      req as Request,
      res as Response,
      next
    );

    expect(AppDataSource.getRepository(Bill).find).toHaveBeenCalledWith({
      where: {
        timestamp: Between(new Date("2023-10-01"), new Date("2023-10-31")),
      },
    });

    expect(result).toEqual([]); // Expecting an empty array
  });
});
