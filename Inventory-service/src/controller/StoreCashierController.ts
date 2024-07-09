import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { StoreCashier } from "../entity/StoreCashier";

export class StoreCashierController {
  private storeCashierRepository = AppDataSource.getRepository(StoreCashier);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.storeCashierRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const cashier_id = parseInt(request.params.cashier_id);

    const cashier = await this.storeCashierRepository.findOne({
      where: { cashier_id },
    });

    if (!cashier) {
      return "Unregistered cashier";
    }
    return cashier;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { store_id, employee_id } = request.body;

    const cashier = Object.assign(new StoreCashier(), {
      store_id,
      employee_id,
    });

    return this.storeCashierRepository.save(cashier);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const cashier_id = parseInt(request.params.cashier_id);

    let cashierToRemove = await this.storeCashierRepository.findOneBy({
      cashier_id,
    });

    if (!cashierToRemove) {
      return "This cashier does not exist";
    }

    await this.storeCashierRepository.remove(cashierToRemove);

    return "Cashier has been removed";
  }
}
