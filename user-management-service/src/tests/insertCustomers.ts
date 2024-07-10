import { AppDataSource } from "../data-source";
import { Customer } from "../entity/Customer";

export async function insertCustomers() {
  const customers = [
    {
      nic: "200429305188",
      name: "Ranil Wickramasinghe",
      address: "112/2, Kuruduwatta Rd, Narahenpita",
      mobile: "0775380370",
      loyalty_points: 100,
    },
    {
      nic: "200308659608",
      name: "Boatyard Kimbula",
      address: "201/1, Bolgoda Lake, Katubedda",
      mobile: "0773382373",
      loyalty_points: 50,
    },
  ];

  for (const customer of customers) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Customer, customer)
    );
  }
}
