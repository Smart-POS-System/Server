import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";
import { BillController } from "../controllers/billController";

const router = express.Router();

router.get("/getOrder", BillController.getAllOrders);

export { router as getOrder };
