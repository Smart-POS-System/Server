//handle http req
//see if the user is valid or not (jwt)
//add cashier_id ,add location_id

import { Request, Response } from "express";
import { BillService } from "../services/billService";
import { Bill_Status, Payment_Methods } from "../enums/bills.enum";

export class BillController {
  //creating a new order
  static async createNewOrder(req: Request, res: Response) {
    console.log(req.body);
    try {
      // Extract data from the request body
      const {
        discount,
        cashier_id,
        store_id,
        customer_id,
        items,
        paymentmethod,
        status,
      } = req.body;

      //const status = Bill_Status.PENDING;
      //const payment_method = Payment_Methods.CARD;
      //console.log(Bill_Status.PENDING);
      let payment_method;
      if (paymentmethod === "card") {
        //const status = Bill_Status.PENDING;
        payment_method = Payment_Methods.CARD;
      }
      // else (paymentmethod === "cash")
      else {
        //const status = Bill_Status.PENDING;
        payment_method = Payment_Methods.CASH;
      }
      let BillStatus = Bill_Status.PROCESSED;
      if (status === "stashed") {
        BillStatus = Bill_Status.PENDING;
      }

      // Call the service method and pass the extracted data
      const newBill = await BillService.createNewBill(
        discount,
        payment_method,
        cashier_id, // Assuming cashier_id corresponds to employeeId
        store_id,
        customer_id,
        items,
        BillStatus
      );

      res
        .status(201)
        .json({ message: "Bill created successfully", bill: newBill });
    } catch (error) {
      console.error("Error creating bill:", error);
      res.status(500).json({ message: "Error creating bill" });
    }
  }

  //getting all orders for reports
  static async getAllOrders(req: Request, res: Response) {
    try {
      const bills = await BillService.getAllBills();
      res.status(200).json(bills);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ message: "Error fetching all orders" });
    }
  }

  //changing the order status
  static async changeStatus(req: Request, res: Response) {
    const { bill_id, status } = req.body;
    console.log(bill_id);
    try {
      const bill = await BillService.changeStatus(bill_id, status);
      res.status(200).send({ msg: "bill status changed" });
    } catch (error) {
      console.error("Error changing the state: ", error);
      res.status(500).json({ msg: "Error changing the state" });
    }
  }
}
