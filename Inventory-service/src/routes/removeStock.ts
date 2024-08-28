import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockControllers";

const router = express.Router();

router.delete("/removeStock/:id", StockController.removeStock);

export { router as removeStock };
