import { getEmployee } from "../common-functions/getEmployee";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Region } from "../entity/Region";
import { Store } from "../entity/Store";

export async function insertStores() {
  const stores = [
    {
      region: await AppDataSource.manager.findOneBy(Region, {
        name: "Colombo",
      }),
      name: "Pitakotte Pagoda Road Store",
      location: "6.927079,79.861244",
      manager: AppDataSource.manager.create(Employee, await getEmployee(4)),
    },
    {
      region: await AppDataSource.manager.findOneBy(Region, {
        name: "Ratnapura",
      }),
      name: "Ratnapura Ambiliwatta Road Store",
      location: "6.682780,80.399170",
      manager: AppDataSource.manager.create(Employee, await getEmployee(7)),
    },
  ];

  for (const store of stores) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Store, store)
    );
  }
}
