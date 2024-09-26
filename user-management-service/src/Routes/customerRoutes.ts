import express from "express";
import { protect } from "../Controllers/authController";
import { getCustomer, getCustomers } from "../Controllers/customerController";
import { errorHandler } from "../Controllers/errorController";

const router = express.Router();

router.get("/", protect, getCustomers, errorHandler);
router.get("/:mobile", protect, getCustomer, errorHandler);

export { router as customerRouter };
