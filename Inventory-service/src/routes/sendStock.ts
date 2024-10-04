import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.post("/sendStock", StockController.sendStock);
/* 
    Stock id, Quantity, Source Id, Destination Id should be passed in the request body as
    {
        stockId:
        qty:
        src:
        dest:
    }
*/

export { router as sendStock };
