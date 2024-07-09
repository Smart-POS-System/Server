import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Inventory } from "../entity/Inventory";

export class InventoryController {
  private inventoryRepository = AppDataSource.getRepository(Inventory);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.inventoryRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const inventory_id = parseInt(request.params.inventory_id);

    const inventory = await this.inventoryRepository.findOne({
      where: { inventory_id },
    });

    if (!inventory) {
      return "Unregistered inventory";
    }
    return inventory;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { region_id, name, location, manager_id } = request.body;

    const inventory = Object.assign(new Inventory(), {
      region_id,
      name,
      location,
      manager_id,
    });

    return this.inventoryRepository.save(inventory);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const inventory_id = parseInt(request.params.inventory_id);

    let inventoryToRemove = await this.inventoryRepository.findOneBy({
      inventory_id,
    });

    if (!inventoryToRemove) {
      return "This inventory does not exist";
    }

    await this.inventoryRepository.remove(inventoryToRemove);

    return "Inventory has been removed";
  }
}
