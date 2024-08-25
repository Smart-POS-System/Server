import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Item } from "../entities/Item";
import { Product } from "../entities/Product";
import { QueryFailedError } from "typeorm";

export class ItemController {
  private itemRepository = AppDataSource.getRepository(Item);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.itemRepository.find({ relations: ["product"] });
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const item_id = parseInt(request.params.item_id);

    const item = await this.itemRepository.findOne({
      where: { item_id },
      relations: ["product"],
    });

    if (!item) {
      return "Unregistered item";
    }
    return item;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    console.log("In actual action method now...");

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

    // Try and save the Item entity to the database
    return await this.itemRepository.save(item);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const item_id = parseInt(request.params.item_id);

    let itemToRemove = await this.itemRepository.findOneBy({ item_id });

    if (!itemToRemove) {
      return response
        .status(404)
        .json({ message: "No item with item_id: " + item_id.toString() });
    }

    await this.itemRepository.remove(itemToRemove);

    return "Item has been removed";
  }
}
