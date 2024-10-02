import { Between } from "typeorm";
import { AppDataSource } from "../data-source";
import { Bill } from "../entity/Bill";
import { Request, Response, NextFunction } from "express";

export class TransactionController {
  private billRepository = AppDataSource.getRepository(Bill);

  async getBillData(request: Request, response: Response, next: NextFunction) {
    const startDate = request.query?.startDate as string;
    const endDate = request.query?.endDate as string;

    const bills = await this.billRepository
      .createQueryBuilder("bill")
      .leftJoinAndSelect("bill.customer", "customer")
      .leftJoinAndSelect("bill.employee", "employee")
      .leftJoinAndSelect("bill.store", "store")
      .where("bill.timestamp BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
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
      items: bill.items,
      amount: bill.items.reduce(
        (
          sum: number,
          item: { price: number; quantity: number; product_name: string }
        ) => sum + item.price * item.quantity,
        0
      ), // Calculating the total amount from items
      discount: bill.discount,
      payment_method: bill.payment_method,
    }));

    return formattedBills;
  }
}
