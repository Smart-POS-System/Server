import { getEmployee } from "../common-functions/getEmployee";
import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Store } from "../entity/Store";
import { StoreCashier } from "../entity/StoreCashier";

export async function insertCashiers() {
  const cashiers = [
    {
      store: await AppDataSource.manager.findOneBy(Store, {
        name: "Pitakotte Pagoda Road Store",
      }),
      employee: AppDataSource.manager.create(Employee, await getEmployee(3)),
    },
    {
      store: await AppDataSource.manager.findOneBy(Store, {
        name: "Ratnapura Ambiliwatta Road Store",
      }),
      employee: AppDataSource.manager.create(Employee, await getEmployee(8)),
    },
  ];

  for (const cashier of cashiers) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(StoreCashier, cashier)
    );
  }
}
