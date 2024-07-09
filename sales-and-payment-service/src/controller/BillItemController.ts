import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { BillItem } from "../entity/BillItem";

export class BillItemController {
  private billItemRepository = AppDataSource.getRepository(BillItem);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.billItemRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const bill_id = parseInt(request.params.bill_id);
    const item_id = parseInt(request.params.item_id);

    const billItem = await this.billItemRepository.findOne({
      where: { bill: { bill_id }, item: { item_id } },
      relations: { bill: true, item: true },
    });

    if (!billItem) {
      return "Unregistered billItem";
    }
    return billItem;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { bill, item, quantity, discount } = request.body;

    const billItem = Object.assign(new BillItem(), {
      bill,
      item,
      quantity,
      discount,
    });

    return this.billItemRepository.save(billItem);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const bill_id = parseInt(request.params.bill_id);
    const item_id = parseInt(request.params.item_id);

    let billItemToRemove = await this.billItemRepository.findOneBy({
      bill: { bill_id },
      item: { item_id },
    });

    if (!billItemToRemove) {
      return "this billItem does not exist";
    }

    await this.billItemRepository.remove(billItemToRemove);

    return "BillItem has been removed";
  }
}
