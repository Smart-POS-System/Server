import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";

const validateItem = (req: Request, res: Response, next: NextFunction) => {
  console.log("Checking if valid Item object is inputted...");

  const { product_id, buying_price, selling_price, mfd, exp } = req.body;

  console.log(product_id, buying_price, selling_price, mfd, exp);

  if (
    product_id != null &&
    buying_price != null &&
    selling_price != null &&
    mfd != null &&
    exp != null
  ) {
    next();
  } else {
    return res
      .status(400)
      .send(
        "Missing one or more fields. Item must contain fields: product_id, buying_price, selling_price, mfd, exp, and optionally, batch_no"
      );
  }
};

export default validateItem;
