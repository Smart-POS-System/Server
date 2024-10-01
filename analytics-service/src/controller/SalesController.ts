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
}
