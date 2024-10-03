import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.post("/addStock", StockController.addStock);

export { router as addStock };
