import { Between } from "typeorm";
import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Bill } from "../entity/Bill";

export class SalesController {
  private billRepository = AppDataSource.getRepository(Bill);

  async getTotalSalesData(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const startDate = new Date(request.query.startDate);
    const endDate = new Date(request.query.endDate);

    const bills = await this.billRepository.find({
      where: {
        timestamp: Between(new Date(startDate), new Date(endDate)),
      },
      order: {
        timestamp: "ASC",
      },
    });

    const salesMap = new Map<string, number>();

    // Process each bill
    for (const bill of bills) {
      const items = bill.items;
      let billTotal = 0;

      for (const item of items) {
        billTotal += item.quantity * item.price;
      }

      const date = bill.timestamp.toISOString().split("T")[0];

      if (salesMap.has(date)) {
        salesMap.set(date, salesMap.get(date)! + billTotal);
      } else {
        salesMap.set(date, billTotal);
      }
    }

    const salesData = Array.from(salesMap.entries()).map(([date, amount]) => ({
      date,
      amount,
    }));

    return salesData;
  }

  async getTopSellingProducts(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const startDate = new Date(request.query.startDate);
    const endDate = new Date(request.query.endDate);

    const bills = await this.billRepository.find({
      where: {
        timestamp: Between(new Date(startDate), new Date(endDate)),
      },
      order: {
        timestamp: "ASC",
      },
    });

    const mostOccuringMap = new Map<string, number>();

    for (const bill of bills) {
      const items = bill.items;

      for (const item of items) {
        if (mostOccuringMap.has(item.product_name)) {
          mostOccuringMap.set(
            item.product_name,
            mostOccuringMap.get(item.product_name)! + item.quantity
          );
        } else {
          mostOccuringMap.set(item.product_name, item.quantity);
        }
      }
    }

    const top4Products = Array.from(mostOccuringMap.entries())
      .sort((a, b) => b[1] - a[1]) // Sort in descending order based on quantity
      .slice(0, 4); // Take the top 4 entries

    // Format the result as needed
    const topSellingData = top4Products.map(([product_name, quantity]) => ({
      product_name,
      quantity,
    }));

    return topSellingData;
  }
}
