import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";

const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { product_name, unit_weight } = req.body;

  if (product_name != null && unit_weight != null) {
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
