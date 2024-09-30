import express, { Request, Response } from "express";
import { StockController } from "../controllers/stockController";

const router = express.Router();

router.get("/expires", StockController.getExpires);

export { router as getExpires };
