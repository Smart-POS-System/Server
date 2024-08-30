import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { AppDataSource } from "./../data-source";
import { Item } from "../entities/Item";

const doesItemExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const item_id = req.params.item_id;
  console.log(`Checking if item with item_id ${item_id} exists...`);

  const item = await AppDataSource.getRepository(Item).findOne({
    where: { item_id },
    relations: ["product"],
  });

  if (!item) {
    return res.status(404).send("There is no item with item_id " + item_id);
  } else {
    req.body.item = item;
    next();
  }
};

export default doesItemExist;
