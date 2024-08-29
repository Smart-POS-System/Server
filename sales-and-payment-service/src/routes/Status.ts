import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";
import { Bill_Status } from "../enums/bills.enum";
import { BillController } from "../controllers/billController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateReq";

const router = express.Router();

router.post(
  "/status",
  [
    body("bill_id").notEmpty().withMessage("bill_id must be provided"),

    body("status")
      .notEmpty()
      .isIn(["stash", "complete", "cancelled"])
      .withMessage(
        "Status must be one of the following: pending, completed, cancelled"
      ),
  ],
  validateRequest,
  BillController.changeStatus
  // async (req: Request, res: Response) => {
  //   const order_id = 3;

  //   const orderRepository = AppDataSource.getRepository(Bill);
  //   const bill = await orderRepository.findOneBy({ bill_id: order_id });
  //   if (bill) {
  //     bill.status = Bill_Status.CANCELLED;
  //     await orderRepository.save(bill);
  //     res.send({ msg: "bill status updated" }).status(200);
  //   } else {
  //     res.send({ msg: "no such bill exsists" }).status(404);
  //   }
  //}
);

export { router as status };
