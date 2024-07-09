import { getItem } from "../common-functions/getItem";
import { AppDataSource } from "../data-source";
import { Bill } from "../entity/Bill";
import { BillItem } from "../entity/BillItem";
import { Item } from "../entity/Item";

export async function insertBillItems() {
  const billItems = [
    {
      bill: await AppDataSource.manager.findOneBy(Bill, { bill_id: 1 }),
      item: AppDataSource.manager.create(Item, await getItem(3)),
      quantity: 2,
    },
    {
      bill: await AppDataSource.manager.findOneBy(Bill, { bill_id: 1 }),
      item: AppDataSource.manager.create(Item, await getItem(6)),
      quantity: 4,
    },
    {
      bill: await AppDataSource.manager.findOneBy(Bill, { bill_id: 2 }),
      item: AppDataSource.manager.create(Item, await getItem(4)),
      quantity: 1,
    },
    {
      bill: await AppDataSource.manager.findOneBy(Bill, { bill_id: 2 }),
      item: AppDataSource.manager.create(Item, await getItem(8)),
      quantity: 3,
    },
  ];

  for (const billItem of billItems) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(BillItem, billItem)
    );
  }
}
