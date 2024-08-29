import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";

const router = express.Router();

router.get("/getOrderbyId", async (req: Request, res: Response) => {
  const order_id = 3;
  const orderRepository = AppDataSource.getRepository(Bill);
  const bills = await orderRepository.findOneBy({ bill_id: order_id });
  console.log(bills);
  res.send(bills).status(200);
});

export { router as getOrderbyId };
