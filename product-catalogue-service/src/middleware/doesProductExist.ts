import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";

const doesProductExist = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { product_id } = req.body;
  if (!product_id) {
    product_id = req.params.product_id;
  }

  // Fetch the Product entity using the product_id
  const product = await AppDataSource.getRepository(Product).findOne({
    where: { product_id },
  });

  if (!product) {
    return res
      .status(404)
      .send(
        "There is no product in the database with the product_id: " + product_id
      );
  } else {
    delete req.body.product_id;
    req.body.product = product;
    next();
  }
};

export default doesProductExist;
