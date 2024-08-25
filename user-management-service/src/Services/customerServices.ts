import { AppDataSource } from "../data-source";
import { Customer } from "../entities/Customer";

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

export const getOneCustomer = async (mobile: string) => {
  const customerRepository = AppDataSource.getRepository(Customer);
  const customer = await customerRepository.findOne({ where: { mobile } });

  return customer;
};
