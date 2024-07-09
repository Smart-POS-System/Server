import { getEmployee } from "../common-functions/getEmployee";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Store } from "../entity/Store";
import { StoreSupervisor } from "../entity/StoreSupervisor";

export async function insertStoreSupervisors() {
  const storeSupervisors = [
    {
      store: await AppDataSource.manager.findOneBy(Store, {
        name: "Pitakotte Pagoda Road Store",
      }),
      employee: AppDataSource.manager.create(Employee, await getEmployee(6)),
    },
    {
      store: await AppDataSource.manager.findOneBy(Store, {
        name: "Ratnapura Ambiliwatta Road Store",
      }),
      employee: AppDataSource.manager.create(Employee, await getEmployee(10)),
    },
  ];

  for (const supervisor of storeSupervisors) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(StoreSupervisor, supervisor)
    );
  }
}
