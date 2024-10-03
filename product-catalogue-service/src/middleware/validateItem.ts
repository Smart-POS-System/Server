import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import { isItemValid } from "../helpers/isItemValid";

const validateItem = (req: Request, res: Response, next: NextFunction) => {
  if (isItemValid(req.body)) {
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
