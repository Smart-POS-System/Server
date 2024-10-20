// import { AppDataSource } from "../data-source";
// import { BillService } from "../services/BillService";
// import { Bill } from "../entities/Bill";
// import { Employee } from "../entities/Employee";
// import { Customer } from "../entities/Customer";
// import { Location } from "../entities/Location";
// import { Bill_Status, Payment_Methods } from "../enums/bills.enum";
// import { Repository } from 'typeorm';
// import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// let billRepository: DeepMockProxy<Repository<Bill>>;
// let employeeRepository: DeepMockProxy<Repository<Employee>>;
// let customerRepository: DeepMockProxy<Repository<Customer>>;
// let locationRepository: DeepMockProxy<Repository<Location>>;

// beforeEach(() => {
//   // Initialize mocks
//   billRepository = mockDeep<Repository<Bill>>();
//   employeeRepository = mockDeep<Repository<Employee>>();
//   customerRepository = mockDeep<Repository<Customer>>();
//   locationRepository = mockDeep<Repository<Location>>();

//   // Replace the repositories in AppDataSource with mocks
//   AppDataSource.getRepository = jest.fn()
//     .mockImplementation((entity) => {
//       switch (entity) {
//         case Bill:
//           return billRepository;
//         case Employee:
//           return employeeRepository;
//         case Customer:
//           return customerRepository;
//         case Location:
//           return locationRepository;
//         default:
//           throw new Error(`No mock for repository of ${entity}`);
//       }
//     });
// });

// describe("BillService", () => {
//   describe("createNewBill", () => {
//     it("should create a new bill and save it", async () => {
//       const employee = new Employee();
//       const location = new Location();
//       const items = [];

//       employeeRepository.findOneBy.mockResolvedValue(employee);
//       locationRepository.findOneBy.mockResolvedValue(location);

//       billRepository.create.mockReturnValue({} as Bill);
//       billRepository.save.mockResolvedValue({} as Bill);

//       const result = await BillService.createNewBill(
//         10,
//         Payment_Methods.CASH,
//         1,
//         1,
//         null,
//         items,
//         Bill_Status.PENDING
//       );

//       expect(employeeRepository.findOneBy).toHaveBeenCalledWith({ employee_id: 1 });
//       expect(locationRepository.findOneBy).toHaveBeenCalledWith({ location_id: 1 });
//       expect(billRepository.create).toHaveBeenCalledWith({
//         discount: 10,
//         payment_method: Payment_Methods.CASH,
//         status: Bill_Status.PENDING,
//         employee,
//         store: location,
//         items
//       });
//       expect(billRepository.save).toHaveBeenCalledWith({});
//       expect(result).toEqual({} as Bill);
//     });
//   });

//   describe("getAllBills", () => {
//     it("should return all bills", async () => {
//       const bills = [new Bill(), new Bill()];
//       billRepository.find.mockResolvedValue(bills);

//       const result = await BillService.getAllBills();

//       expect(billRepository.find).toHaveBeenCalled();
//       expect(result).toEqual(bills);
//     });
//   });

//   describe("changeStatus", () => {
//     it("should update bill status to complete", async () => {
//       const bill = new Bill();
//       bill.bill_id = 1;
//       bill.status = Bill_Status.PENDING;

//       billRepository.findOneBy.mockResolvedValue(bill);
//       billRepository.save.mockResolvedValue(bill);

//       await BillService.changeStatus(1, "complete");

//       expect(billRepository.findOneBy).toHaveBeenCalledWith({ bill_id: 1 });
//       expect(bill.status).toBe(Bill_Status.PROCESSED);
//       expect(billRepository.save).toHaveBeenCalledWith(bill);
//     });

//     it("should update bill status to cancelled", async () => {
//       const bill = new Bill();
//       bill.bill_id = 1;
//       bill.status = Bill_Status.PENDING;

//       billRepository.findOneBy.mockResolvedValue(bill);
//       billRepository.save.mockResolvedValue(bill);

//       await BillService.changeStatus(1, "cancelled");

//       expect(billRepository.findOneBy).toHaveBeenCalledWith({ bill_id: 1 });
//       expect(bill.status).toBe(Bill_Status.CANCELLED);
//       expect(billRepository.save).toHaveBeenCalledWith(bill);
//     });

//     it("should update bill status to pending", async () => {
//       const bill = new Bill();
//       bill.bill_id = 1;
//       bill.status = Bill_Status.PROCESSED;

//       billRepository.findOneBy.mockResolvedValue(bill);
//       billRepository.save.mockResolvedValue(bill);

//       await BillService.changeStatus(1, "stash");

//       expect(billRepository.findOneBy).toHaveBeenCalledWith({ bill_id: 1 });
//       expect(bill.status).toBe(Bill_Status.PENDING);
//       expect(billRepository.save).toHaveBeenCalledWith(bill);
//     });
//   });
// });
