import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Store } from "../entity/Store";

export class StoreController {
  private storeRepository = AppDataSource.getRepository(Store);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.storeRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const store_id = parseInt(request.params.store_id);

    const store = await this.storeRepository.findOne({
      where: { store_id },
    });

    if (!store) {
      return "Unregistered store";
    }
    return store;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { region_id, name, location, manager_id } = request.body;

    const store = Object.assign(new Store(), {
      region_id,
      name,
      location,
      manager_id,
    });

    return this.storeRepository.save(store);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const store_id = parseInt(request.params.store_id);

    let storeToRemove = await this.storeRepository.findOneBy({ store_id });

    if (!storeToRemove) {
      return "this store not exist";
    }

    await this.storeRepository.remove(storeToRemove);

    return "Store has been removed";
  }
}
