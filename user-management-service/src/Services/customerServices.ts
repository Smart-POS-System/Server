import { Customer } from "../entity/Customer";
import { AppDataSource } from "./../index";

export const getAllCustomers = async () => {
  const customerRepository = AppDataSource.getRepository(Customer);
  const customers = await customerRepository.find();

  return customers;
};

export const getOneCustomer = async (nic: string) => {
  const customerRepository = AppDataSource.getRepository(Customer);
  const customer = await customerRepository.findOne({ where: { nic } });

  return customer;
};
