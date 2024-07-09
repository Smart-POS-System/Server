import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { InventoryStock } from "../entity/InventoryStock";

export class InventoryStockController {
  private inventoryStockRepository =
    AppDataSource.getRepository(InventoryStock);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.inventoryStockRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const stock_id = parseInt(request.params.stock_id);

    const stock = await this.inventoryStockRepository.findOne({
      where: { stock_id },
    });

    if (!stock) {
      return "Unregistered stock";
    }
    return stock;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { item_id, inventory_id, quantity, supervisor_id, manager_id } =
      request.body;

    const stock = Object.assign(new InventoryStock(), {
      item_id,
      inventory_id,
      quantity,
      supervisor_id,
      manager_id,
    });

    return this.inventoryStockRepository.save(stock);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const stock_id = parseInt(request.params.stock_id);

    let stockToRemove = await this.inventoryStockRepository.findOneBy({
      stock_id,
    });

    if (!stockToRemove) {
      return "This stock does not exist";
    }

    await this.inventoryStockRepository.remove(stockToRemove);

    return "Stock has been removed";
  }
}
