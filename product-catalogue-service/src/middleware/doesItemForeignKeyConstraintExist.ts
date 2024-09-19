import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

const doesItemForeignKeyConstraintExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { product } = req.body;

  const productWithItems = await AppDataSource.getRepository(Product).findOne({
    where: { product_id: product.product_id },
    relations: ["items"],
  });

  if (productWithItems.items.length > 0) {
    return res
      .status(400)
      .send(
        "There are items linked to this product. Delete the items before deleting the products..."
      );
  } else {
    req.body.product = product;
    next();
  }
};

export default doesItemForeignKeyConstraintExist;
