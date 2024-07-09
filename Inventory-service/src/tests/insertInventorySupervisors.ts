import { getEmployee } from "../common-functions/getEmployee";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Inventory } from "../entity/Inventory";
import { InventorySupervisor } from "../entity/InventorySupervisor";

export async function insertInventorySupervisors() {
  const inventorySupervisors = [
    {
      inventory: await AppDataSource.manager.findOneBy(Inventory, {
        name: "Jubilee Post Warehouse",
      }),
      employee: AppDataSource.manager.create(Employee, await getEmployee(9)),
    },
    {
      inventory: await AppDataSource.manager.findOneBy(Inventory, {
        name: "New Town Road Warehouse",
      }),
      employee: AppDataSource.manager.create(Employee, await getEmployee(12)),
    },
  ];

  for (const supervisor of inventorySupervisors) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(InventorySupervisor, supervisor)
    );
  }
}
