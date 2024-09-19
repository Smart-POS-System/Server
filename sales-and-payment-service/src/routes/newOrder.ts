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

router.post(
  "/newOrder",

  BillController.createNewOrder
);
//async (req: Request, res: Response) => {
//   try {
//     const orderRepository = AppDataSource.getRepository(Bill);
//     const employeeRepository = AppDataSource.getRepository(Employee);
//     const customerRepository = AppDataSource.getRepository(Customer);
//     const locationRepository = AppDataSource.getRepository(Location);

//     // Static data
//     const cashier_id = 2; // Change to an existing employee ID
//     const customer_id = 2; // Change to an existing customer ID
//     const locationId = 1; // Change to an existing location ID

//     // Fetch related entities
//     const employee = await employeeRepository.findOneBy({
//       employee_id: cashier_id,
//     });
//     // const customer = customerId ? await customerRepository.findOneBy({ customer_id : customer_id }) : null;
//     const location = await locationRepository.findOneBy({
//       location_id: locationId,
//     });

//     if (!employee || !location) {
//       return res
//         .status(404)
//         .json({ message: "Employee or Location not found" });
//     }

//     // Create a new Bill instance with static data
//     const newBill = orderRepository.create({
//       discount: 10.0,
//       payment_method: Payment_Methods.CARD,
//       status: Bill_Status.PROCESSED,
//       employee,
//       store: location,
//       //customer,
//       items: [
//         { itemId: 1, quantity: 2, price: 20.0 }, // Example item data
//         { itemId: 2, quantity: 1, price: 15.0 }, // Example item data
//       ],
//     });

//     // Save the Bill instance to the database
//     await orderRepository.save(newBill);

//     res
//       .status(201)
//       .json({ message: "Bill created successfully", bill: newBill });
//   } catch (error) {
//     console.error("Error creating bill:", error);
//     res.status(500).json({ message: "Error creating bill" });
//   }
// });

export { router as newOrder };
