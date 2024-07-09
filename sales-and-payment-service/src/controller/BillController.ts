import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Bill } from "../entity/Bill";

export class BillController {
  private billRepository = AppDataSource.getRepository(Bill);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.billRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const bill_id = parseInt(request.params.bill_id);

    const bill = await this.billRepository.findOne({
      where: { bill_id },
    });

    if (!bill) {
      return "Unregistered bill";
    }
    return bill;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const {
      cashier_id,
      store_id,
      customer_id,
      discount,
      payment_method,
      status,
    } = request.body;

    const bill = Object.assign(new Bill(), {
      cashier_id,
      store_id,
      customer_id,
      discount,
      payment_method,
      status,
    });

    return this.billRepository.save(bill);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const bill_id = parseInt(request.params.bill_id);

    let billToRemove = await this.billRepository.findOneBy({ bill_id });

    if (!billToRemove) {
      return "This bill does not exist";
    }

    await this.billRepository.remove(billToRemove);

    return "Bill has been removed";
  }
}
