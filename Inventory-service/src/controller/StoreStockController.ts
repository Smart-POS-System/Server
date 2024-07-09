import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { StoreStock } from "../entity/StoreStock";

export class StoreStockController {
  private storeStockRepository = AppDataSource.getRepository(StoreStock);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.storeStockRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const stock_id = parseInt(request.params.stock_id);

    const stock = await this.storeStockRepository.findOne({
      where: { stock_id },
    });

    if (!stock) {
      return "Unregistered stock";
    }
    return stock;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { item_id, store_id, quantity, supervisor_id, manager_id } =
      request.body;

    const stock = Object.assign(new StoreStock(), {
      item_id,
      store_id,
      quantity,
      supervisor_id,
      manager_id,
    });

    return this.storeStockRepository.save(stock);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const stock_id = parseInt(request.params.stock_id);

    let stockToRemove = await this.storeStockRepository.findOneBy({ stock_id });

    if (!stockToRemove) {
      return "This stock does not exist";
    }

    await this.storeStockRepository.remove(stockToRemove);

    return "Stock has been removed";
  }
}
