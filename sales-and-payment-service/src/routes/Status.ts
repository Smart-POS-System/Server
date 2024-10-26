import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";
import { Bill_Status } from "../enums/bills.enum";
import { BillController } from "../controllers/billController";
import { body } from "express-validator";
import { validateRequest } from "../middlewares/validateReq";

const router = express.Router();

router.post(
  "/status",
  [
    body("bill_id").notEmpty().withMessage("bill_id must be provided"),

    body("status")
      .notEmpty()
      .isIn(["stash", "complete", "cancelled"])
      .withMessage(
        "Status must be one of the following: pending, completed, cancelled"
      ),
  ],
  validateRequest,
  BillController.changeStatus
);

export { router as status };
