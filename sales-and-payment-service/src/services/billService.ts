import { AppDataSource } from "../data-source";
import { Bill } from "../entities/Bill";
import { Employee } from "../entities/Employee";
import { Customer } from "../entities/Customer";
import { Location } from "../entities/Location";
import { Bill_Status, Payment_Methods } from "../enums/bills.enum";
import { log } from "console";

export class BillService {
  //add new bill to db
  static async createNewBill(
    discount: number,
    payment_method: Payment_Methods,

    employeeId: number,
    storeId: number,
    customerId: number | null,
    items: any,
    status: Bill_Status
  ) {
    console.log(status);
    console.log(payment_method);
    const orderRepository = AppDataSource.getRepository(Bill);
    const employeeRepository = AppDataSource.getRepository(Employee);
    const customerRepository = AppDataSource.getRepository(Customer);
    const locationRepository = AppDataSource.getRepository(Location);

    // Fetch related entities
    const employee = await employeeRepository.findOneBy({
      employee_id: employeeId,
    });
    //const customer = customerId ? await customerRepository.findOneBy({ customer_id: customerId }) : null;
    const location = await locationRepository.findOneBy({
      location_id: storeId,
    });

    if (!employee || !location) {
      throw new Error("Employee or Location not found");
    }

    // Create a new Bill instance with provided data
    const newBill = orderRepository.create({
      discount,
      payment_method,
      status,
      employee,
      store: location,
      //customer,
      items,
    });

    // Save the Bill instance to the database
    return await orderRepository.save(newBill);
  }
  //get all bils from db
  static async getAllBills() {
    console.log("getting all bills ready!");
    const orderRepository = AppDataSource.getRepository(Bill);

    const bills = await orderRepository.find();
    return bills;
  }

  //changing bill status in db
  static async changeStatus(bill_id: number, status: string) {
    const billRepository = AppDataSource.getRepository(Bill);
    const bill = await billRepository.findOneBy({ bill_id: bill_id });
    if (bill && status === "complete") {
      bill.status = Bill_Status.PROCESSED;
      await billRepository.save(bill);
    }
    if (bill && status === "cancelled") {
      bill.status = Bill_Status.CANCELLED;
      await billRepository.save(bill);
    }
    if (bill && status === "stash") {
      bill.status = Bill_Status.PENDING;
      await billRepository.save(bill);
    }
  }
}
