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
    const startDate = request.query.startDate as string;
    const endDate = request.query.endDate as string;

    // Raw SQL query using TypeORM's query method
    const query = `
      SELECT 
        item->>'product_name' AS product_name, 
        SUM((item->>'quantity')::int) AS total_quantity
      FROM bill,
           jsonb_array_elements(items) AS item
      WHERE timestamp BETWEEN $1 AND $2
      GROUP BY item->>'product_name'
      ORDER BY total_quantity DESC
      LIMIT 4;
    `;

    // Execute the query with parameters (startDate and endDate)
    const topSellingProducts = await this.billRepository.query(query, [
      startDate,
      endDate,
    ]);

    return topSellingProducts;
  }
}
