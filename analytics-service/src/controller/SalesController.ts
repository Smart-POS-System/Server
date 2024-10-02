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
    const startDate = request.query.startDate as string;
    const endDate = request.query.endDate as string;

    const query = `
      SELECT 
        to_char(timestamp::date, 'YYYY-MM-DD') AS date, 
        SUM(bill_total) AS amount
      FROM (
        SELECT 
          timestamp,
          SUM((item->>'price')::numeric * (item->>'quantity')::numeric) AS bill_total
        FROM 
          bill, 
          jsonb_array_elements(items) AS item
        WHERE 
          timestamp BETWEEN $1 AND $2
        GROUP BY timestamp
      ) AS daily_bills
      GROUP BY date
      ORDER BY date ASC;
    `;

    const dailySalesData = await this.billRepository.query(query, [
      startDate,
      endDate,
    ]);

    return dailySalesData;
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
