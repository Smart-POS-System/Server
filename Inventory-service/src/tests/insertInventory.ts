import { getEmployee } from "../common-functions/getEmployee";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Inventory } from "../entity/Inventory";
import { Region } from "../entity/Region";

export async function insertInventory() {
  const inventory = [
    {
      region: await AppDataSource.manager.findOneBy(Region, {
        name: "Colombo",
      }),
      name: "Jubilee Post Warehouse",
      location: "6.862521,79.899879",
      manager: AppDataSource.manager.create(Employee, await getEmployee(10)),
    },
    {
      region: await AppDataSource.manager.findOneBy(Region, {
        name: "Ratnapura",
      }),
      name: "New Town Road Warehouse",
      location: "6.682780,80.419170",
      manager: AppDataSource.manager.create(Employee, await getEmployee(11)),
    },
  ];

  for (const warehouse of inventory) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Inventory, warehouse)
    );
  }
}
