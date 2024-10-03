import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.post("/stocks", StockController.getStocks);

export { router as getStocks };
