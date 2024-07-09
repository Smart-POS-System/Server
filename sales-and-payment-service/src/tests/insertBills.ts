import { getCashier } from "../common-functions/getCashier";
import { getCustomer } from "../common-functions/getCustomer";
import { getStore } from "../common-functions/getStore";
import { AppDataSource } from "../data-source";
import { Bill } from "../entity/Bill";
import { Customer } from "../entity/Customer";
import { Store } from "../entity/Store";
import { StoreCashier } from "../entity/StoreCashier";

export async function insertBills() {
  const bills = [
    {
      cashier: AppDataSource.manager.create(StoreCashier, await getCashier(1)),
      store: AppDataSource.manager.create(Store, await getStore(1)),
      customer: AppDataSource.manager.create(
        Customer,
        await getCustomer("200429305188")
      ),
      payment_method: "card",
      status: "Success",
    },
    {
      cashier: AppDataSource.manager.create(StoreCashier, await getCashier(2)),
      store: AppDataSource.manager.create(Store, await getStore(2)),
      customer: AppDataSource.manager.create(
        Customer,
        await getCustomer("0773382373")
      ),
      payment_method: "cash",
      status: "Success",
    },
  ];

  for (const bill of bills) {
    await AppDataSource.manager.save(AppDataSource.manager.create(Bill, bill));
  }
}
