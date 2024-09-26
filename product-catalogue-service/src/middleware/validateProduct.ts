import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { isProductValid } from "../helpers/isProductValid";

const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  if (isProductValid(req.body)) {
    next();
  } else {
    return res
      .status(400)
      .send(
        "Missing one or more fields. Product must contain fields: product_name and unit_weight"
      );
  }
};

export default validateProduct;
