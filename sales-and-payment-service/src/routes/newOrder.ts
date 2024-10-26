import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";
import { Employee } from "../entities/Employee";
import { Customer } from "../entities/Customer";
import { Location } from "../entities/Location";
import { Bill_Status, Payment_Methods } from "../enums/bills.enum";
import { BillController } from "../controllers/billController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateReq";

export { router as billRoutes };

const router = express.Router();

router.post("/newOrder", BillController.createNewOrder);

export { router as newOrder };
