import { BillService } from "./billService";
import { AppDataSource } from "../data-source";
import { Bill_Status, Payment_Methods } from "../enums/bills.enum";
import { Bill } from "../entities/Bill";
import { Employee } from "../entities/Employee";
import { Location } from "../entities/Location";

jest.mock("../data-source");

const mockBillRepository = {
  create: jest.fn(),
  save: jest.fn(),
  findOneBy: jest.fn(),
  find: jest.fn(),
};

const mockEmployeeRepository = {
  findOneBy: jest.fn(),
};

const mockLocationRepository = {
  findOneBy: jest.fn(),
};

AppDataSource.getRepository = jest.fn().mockImplementation((entity) => {
  if (entity === Bill) return mockBillRepository;
  if (entity === Employee) return mockEmployeeRepository;
  if (entity === Location) return mockLocationRepository;
});
describe("BillService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new bill", async () => {
    const mockEmployee = { employee_id: 1 };
    const mockLocation = { location_id: 1 };
    const mockBill = { id: 1, items: [] };

    mockEmployeeRepository.findOneBy.mockResolvedValue(mockEmployee);
    mockLocationRepository.findOneBy.mockResolvedValue(mockLocation);
    mockBillRepository.create.mockReturnValue(mockBill);
    mockBillRepository.save.mockResolvedValue(mockBill);

    const result = await BillService.createNewBill(
      10,
      Payment_Methods.CASH,
      1,
      1,
      null,
      [],
      Bill_Status.PENDING
    );

    expect(mockEmployeeRepository.findOneBy).toHaveBeenCalledWith({
      employee_id: 1,
    });
    expect(mockLocationRepository.findOneBy).toHaveBeenCalledWith({
      location_id: 1,
    });
    expect(mockBillRepository.create).toHaveBeenCalledWith({
      discount: 10,
      payment_method: Payment_Methods.CASH,
      status: Bill_Status.PENDING,
      employee: mockEmployee,
      store: mockLocation,
      items: [],
    });
    expect(mockBillRepository.save).toHaveBeenCalledWith(mockBill);
    expect(result).toEqual(mockBill);
  });
});

it("should return all bills", async () => {
  const mockBills = [{ bill_id: 1 }, { bill_id: 2 }];
  mockBillRepository.find.mockResolvedValue(mockBills);

  const result = await BillService.getAllBills();

  expect(mockBillRepository.find).toHaveBeenCalled();
  expect(result).toEqual(mockBills);
});

it("should change the bill status to PROCESSED", async () => {
  const mockBill = { bill_id: 1, status: Bill_Status.PENDING };
  mockBillRepository.findOneBy.mockResolvedValue(mockBill);

  await BillService.changeStatus(1, "complete");

  expect(mockBillRepository.findOneBy).toHaveBeenCalledWith({ bill_id: 1 });
  expect(mockBill.status).toBe(Bill_Status.PROCESSED);
  expect(mockBillRepository.save).toHaveBeenCalledWith(mockBill);
});

it("should change the bill status to CANCELLED", async () => {
  const mockBill = { bill_id: 1, status: Bill_Status.PENDING };
  mockBillRepository.findOneBy.mockResolvedValue(mockBill);

  await BillService.changeStatus(1, "cancelled");

  expect(mockBillRepository.findOneBy).toHaveBeenCalledWith({ bill_id: 1 });
  expect(mockBill.status).toBe(Bill_Status.CANCELLED);
  expect(mockBillRepository.save).toHaveBeenCalledWith(mockBill);
});

it("should change the bill status to PENDING", async () => {
  const mockBill = { bill_id: 1, status: Bill_Status.PROCESSED };
  mockBillRepository.findOneBy.mockResolvedValue(mockBill);

  await BillService.changeStatus(1, "stash");

  expect(mockBillRepository.findOneBy).toHaveBeenCalledWith({ bill_id: 1 });
  expect(mockBill.status).toBe(Bill_Status.PENDING);
  expect(mockBillRepository.save).toHaveBeenCalledWith(mockBill);
});
