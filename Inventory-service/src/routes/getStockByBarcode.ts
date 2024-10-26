import express from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.post("/barcode", StockController.getStocksByBarcode);

export { router as getStocksByBarcode };
