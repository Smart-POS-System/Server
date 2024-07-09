import { getEmployee } from "../common-functions/getEmployee";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Region } from "../entity/Region";

export async function insertRegions() {
  const regions = [
    {
      name: "Ratnapura",
      manager: AppDataSource.manager.create(Employee, await getEmployee(1)),
    },
    {
      name: "Colombo",
      manager: AppDataSource.manager.create(Employee, await getEmployee(2)),
    },
  ];

  for (const region of regions) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Region, region)
    );
  }
}
