import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";
import { BillController } from "../controllers/billController";

const router = express.Router();

router.get(
  "/getOrder",
  BillController.getAllOrders
  // async (req: Request, res: Response) => {
  //   const orderRepository = AppDataSource.getRepository(Bill);
  //   const bills = await orderRepository.find();
  //   console.log(bills);
  //   res.send(bills).status(200);
  //}
);

export { router as getOrder };
