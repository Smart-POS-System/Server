import { AppDataSource } from "../data-source";
import { Bill } from "../entity/Bill";
import { Request, Response, NextFunction } from "express";
import dayjs = require("dayjs");

export class TransactionController {
  private billRepository = AppDataSource.getRepository(Bill);

  async getBillData(request: Request, response: Response, next: NextFunction) {
    const startDate = request.query?.startDate as string;
    const endDate = request.query?.endDate as string;
    const storeId = request.query?.storeId;

    const query = this.billRepository
      .createQueryBuilder("bill")
      .leftJoinAndSelect("bill.customer", "customer")
      .leftJoinAndSelect("bill.employee", "employee")
      .leftJoinAndSelect("bill.store", "store");

    // Ensure both startDate and endDate are provided and in valid format
    if (
      startDate &&
      endDate &&
      dayjs(startDate).isValid() &&
      dayjs(endDate).isValid()
    ) {
      query.where("bill.timestamp BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      });
    }

    if (storeId && parseInt(storeId) > 0) {
      query.andWhere("bill.store_id = :storeId", { storeId });
    }

    const bills = await query
      .select([
        "bill.bill_id",
        "bill.discount",
        "bill.timestamp",
        "bill.payment_method",
        "bill.status",
        "bill.items",
        "customer.name", // Only selecting customer name
        "employee.name", // Only selecting employee name
        "store.name", // Only selecting store name
      ])
      .orderBy("bill.timestamp", "DESC")
      .getMany();

    // Format the result to match the frontend table's `dataIndex`
    const formattedBills = bills.map((bill) => ({
      bill_id: bill.bill_id,
      date: bill.timestamp, // Assuming this is the formatted date
      customer_name: bill.customer.name,
      cashier: bill.employee.name,
      store: bill.store.name,
      items: bill.items || [], // Ensure items is an array
      amount: (bill.items || []).reduce(
        (
          sum: number,
          item: { price: number; quantity: number; product_name: string }
        ) => sum + item.price * item.quantity,
        0
      ), // Calculating the total amount from items
      discount: bill.discount,
      payment_method: bill.payment_method,
    }));

    // Send the formatted bills as the response
    return formattedBills;
  }

  async getTotalRevenue(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const startDate = request.query?.startDate;
    const endDate = request.query?.endDate;

    let totalRevenue = 0;
    let rawQuery = "";

    let dateRestricted =
      startDate &&
      endDate &&
      dayjs(startDate).isValid() &&
      dayjs(endDate).isValid();

    if (dateRestricted) {
      // SQL query to calculate total revenue within a date range
      rawQuery = `
        SELECT SUM((item->>'price')::numeric * (item->>'quantity')::numeric) AS revenue
        FROM bill,
        LATERAL jsonb_array_elements(bill.items) AS item
        WHERE bill.timestamp BETWEEN $1 AND $2
      `;
    } else {
      // SQL query to calculate total revenue across all bills (no date restriction)
      rawQuery = `
        SELECT SUM((item->>'price')::numeric * (item->>'quantity')::numeric) AS revenue
        FROM bill,
        LATERAL jsonb_array_elements(bill.items) AS item
      `;
    }

    const result = dateRestricted
      ? await this.billRepository.query(rawQuery, [startDate, endDate]) // Query with dates
      : await this.billRepository.query(rawQuery);

    totalRevenue = result[0]?.revenue; // Get the total revenue from the result

    return totalRevenue;
  }
}
