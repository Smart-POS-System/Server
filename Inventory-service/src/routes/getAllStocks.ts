import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.post("/allStocks", StockController.getAllStocks);

export { router as getAllStocks };
