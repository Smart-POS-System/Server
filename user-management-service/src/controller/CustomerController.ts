import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Customer } from "./../entity/Customer";

export class CustomerController {
  private customerRepository = AppDataSource.getRepository(Customer);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.customerRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const param = request.params.param;

    const customer = await this.customerRepository
      .createQueryBuilder()
      .where("mobile = :mobile OR nic = :nic", {
        mobile: param,
        nic: param,
      })
      .getOne();

    if (!customer) {
      return "Unregistered customer";
    }
    return customer;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { nic, name, address, mobile, loyalty_points } = request.body;

    const customer = Object.assign(new Customer(), {
      nic,
      name,
      address,
      mobile,
      loyalty_points,
    });

    return this.customerRepository.save(customer);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const nic = request.params.nic;

    let customerToRemove = await this.customerRepository.findOneBy({ nic });

    if (!customerToRemove) {
      return "This customer does not exist";
    }

    await this.customerRepository.remove(customerToRemove);

    return "Customer has been removed";
  }
}
