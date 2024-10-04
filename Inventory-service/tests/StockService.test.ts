// // StockService.test.ts
// import { StockService } from "../src/services/stockService";
// import { Stock } from "../src/entities/Stock";
// import { Item } from "../src/entities/Item";
// import { Location } from "../src/entities/Location";
// import { Employee } from "../src/entities/Employee";

// describe("StockService", () => {
//   describe("getFlatArray", () => {
//     it("should return a flat array with correct values", () => {
//       const itemId = 1;
//       const stockDetails: Stock = {
//         stock_id: 100,
//         quantity: 50,
//         location: new Location(),
//         employee: new Employee(),
//         item: new Item(),
//         barcode: "",
//       };
//       const productDetails: Item = {
//         selling_price: 20.5,
//         mfd: new Date("2023-01-01"),
//         exp: new Date("2025-01-01"),
//         product: {
//           product_name: "Sample Product",
//           unit_weight: "1.5",
//           product_id: 0,
//           items: [],
//         },
//         item_id: 0,
//         stocks: [],
//         batch_no: 0,
//         buying_price: 0,
//       };

//       const result = StockService.getFlatArray(
//         itemId,
//         stockDetails,
//         productDetails
//       );

//       expect(result).toEqual({
//         stock_id: 100,
//         item_id: itemId,
//         quantity: 50,
//         selling_price: 20.5,
//         mfd: new Date("2023-01-01"),
//         exp: new Date("2025-01-01"),
//         product_name: "Sample Product",
//         unit_weight: "1.5",
//       });
//     });

//     it("should handle edge cases correctly", () => {
//       const itemId = 2;
//       const stockDetails: Stock = {
//         stock_id: 101,
//         quantity: 0,
//         location: new Location(),
//         employee: new Employee(),
//         item: new Item(),
//         barcode: "",
//       };
//       const productDetails: Item = {
//         selling_price: 0,
//         mfd: new Date("2023-01-01"),
//         exp: new Date("2025-01-01"),
//         product: {
//           product_name: "Another Product",
//           unit_weight: "0",
//           product_id: 0,
//           items: [],
//         },
//         item_id: 0,
//         stocks: [],
//         batch_no: 0,
//         buying_price: 0,
//       };

//       const result = StockService.getFlatArray(
//         itemId,
//         stockDetails,
//         productDetails
//       );

//       expect(result).toEqual({
//         stock_id: 101,
//         item_id: itemId,
//         quantity: 0,
//         selling_price: 0,
//         mfd: new Date("2023-01-01"),
//         exp: new Date("2025-01-01"),
//         product_name: "Another Product",
//         unit_weight: "0",
//       });
//     });
//   });
// });

import { StockService } from "../src/services/stockService";
import { AppDataSource } from "../src/data-source";
import { Stock } from "../src/entities/Stock";
import { Item } from "../src/entities/Item";
import { Location } from "../src/entities/Location";

jest.mock("../src/data-source"); // Mock the data source

const mockStockRepository = {
  find: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
};

const mockItemRepository = {
  find: jest.fn(),
};

const mockLocationRepository = {
  find: jest.fn(),
};

beforeEach(() => {
  (AppDataSource.getRepository as jest.Mock).mockImplementation((entity) => {
    if (entity === Stock) return mockStockRepository;
    if (entity === Item) return mockItemRepository;
    if (entity === Location) return mockLocationRepository;
    return null;
  });
});

describe("StockService", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it("should get stocks by location", async () => {
    const mockStocks = [
      { stock_id: 1, quantity: 10, item: { item_id: 1 } },
      { stock_id: 2, quantity: 5, item: { item_id: 2 } },
    ];

    const mockProductDetails = [
      {
        selling_price: 100,
        mfd: new Date(),
        exp: new Date(),
        product: { product_name: "Product A", unit_weight: 1 },
      },
      {
        selling_price: 200,
        mfd: new Date(),
        exp: new Date(),
        product: { product_name: "Product B", unit_weight: 2 },
      },
    ];

    mockStockRepository.find.mockResolvedValue(mockStocks);
    mockItemRepository.find.mockResolvedValueOnce([mockProductDetails[0]]);
    mockItemRepository.find.mockResolvedValueOnce([mockProductDetails[1]]);

    const result = await StockService.getStocksByLocation(1);

    expect(result).toEqual([
      {
        stock_id: 1,
        item_id: 1,
        quantity: 10,
        selling_price: 100,
        mfd: expect.any(Date),
        exp: expect.any(Date),
        product_name: "Product A",
        unit_weight: 1,
      },
      {
        stock_id: 2,
        item_id: 2,
        quantity: 5,
        selling_price: 200,
        mfd: expect.any(Date),
        exp: expect.any(Date),
        product_name: "Product B",
        unit_weight: 2,
      },
    ]);
  });

  it("should add a stock", async () => {
    const stockData = {
      item_id: 1,
      quantity: 10,
      location_id: 1,
      manager_id: 1,
    };

    await StockService.addStock(
      stockData.item_id,
      stockData.quantity,
      stockData.location_id,
      stockData.manager_id
    );

    expect(mockStockRepository.save).toHaveBeenCalledWith(stockData);
  });

  it("should remove a stock", async () => {
    const stockId = 1;
    const mockStock = { stock_id: stockId, quantity: 10 };

    mockStockRepository.findOneBy.mockResolvedValue(mockStock);

    const result = await StockService.removeStock(stockId);

    expect(mockStockRepository.findOneBy).toHaveBeenCalledWith({
      stock_id: stockId,
    });
    expect(result).toBe(true);
  });

  it("should update a stock", async () => {
    const stockId = 1;
    const quantityToRemove = 5;
    const mockStock = { stock_id: stockId, quantity: 10 };

    mockStockRepository.findOneBy.mockResolvedValue(mockStock);

    const result = await StockService.updateStock(stockId, quantityToRemove);

    expect(mockStockRepository.findOneBy).toHaveBeenCalledWith({
      stock_id: stockId,
    });
    expect(mockStock.quantity).toBe(5);
    expect(result).toBe(true);
  });

  // it("should throw error when trying to update with insufficient stocks", async () => {
  //   const stockId = 1;
  //   const quantityToRemove = 15; // More than available
  //   const mockStock = { stock_id: stockId, quantity: 10 }; // Only 10 available

  //   mockStockRepository.findOneBy.mockResolvedValue(mockStock);

  //   await expect(
  //     StockService.updateStock(stockId, quantityToRemove)
  //   ).rejects.toThrow("Not enough stocks available!");
  // });
});
