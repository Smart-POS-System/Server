import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.put("/removeStock", StockController.removeStock);
/* 
    Stock id should be passed in the request body as stockId.
    If there is a quantity to be removed, it should be passed in the request body as qty.
    If no quantity passed, whole stock will be removed.
*/

export { router as removeStock };
