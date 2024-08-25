import { Customer } from "../entity/Customer";
import { AppDataSource } from "../data-source";

export const getAllCustomers = async (queryString: any) => {
  const { page, limit, sortBy, sortOrder } = queryString;
  const customerRepository = AppDataSource.getRepository(Customer);
  const skip = (page - 1) * limit;

  const customers = await customerRepository.find({
    skip,
    take: limit,
    order: {
      [sortBy]: sortOrder,
    },
  });

  return customers;
};

export const getOneCustomer = async (nic: string) => {
  const customerRepository = AppDataSource.getRepository(Customer);
  const customer = await customerRepository.findOne({ where: { nic } });

  return customer;
};
