import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Item } from "../entity/Item";

export class ItemController {
  private itemRepository = AppDataSource.getRepository(Item);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.itemRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const item_id = parseInt(request.params.item_id);

    const item = await this.itemRepository.findOne({
      where: { item_id },
    });

    if (!item) {
      return "Unregistered item";
    }
    return item;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { product_id, batch_code, product_name, unit_weight, mfd, exp } =
      request.body;

    const item = Object.assign(new Item(), {
      product_id,
      batch_code,
      product_name,
      unit_weight,
      mfd,
      exp,
    });

    return this.itemRepository.save(item);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const item_id = parseInt(request.params.item_id);

    let itemToRemove = await this.itemRepository.findOneBy({ item_id });

    if (!itemToRemove) {
      return "This item does not exist";
    }

    await this.itemRepository.remove(itemToRemove);

    return "Item has been removed";
  }
}
