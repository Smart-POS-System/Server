import express from "express";
import { protect } from "../Controllers/authController";
import {
  addCustomer,
  getCustomer,
  getCustomers,
  sendEmailToCustomer,
} from "../Controllers/customerController";
import { errorHandler } from "../Controllers/errorController";

const router = express.Router();

router.get("/", protect, getCustomers, errorHandler);
router.get("/getCustomerByMobile", protect, getCustomer, errorHandler);
router.post("/sendBill", protect, sendEmailToCustomer, errorHandler);
router.post("/addCustomer", protect, addCustomer, errorHandler);

export { router as customerRouter };
