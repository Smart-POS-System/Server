import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Item } from "../entities/Item";

export class ItemController {
  private itemRepository = AppDataSource.getRepository(Item);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.itemRepository.find({ relations: ["product"] });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    return request.body.item;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { product, batch_no, buying_price, selling_price, mfd, exp } =
      request.body;

    // Create and assign the Item entity
    const item = Object.assign(new Item(), {
      product, // Associate the Product entity with the Item
      batch_no,
      buying_price,
      selling_price,
      mfd,
      exp,
    });

    return await this.itemRepository.save(item);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    return await this.itemRepository.remove(request.body.item);
  }
}
