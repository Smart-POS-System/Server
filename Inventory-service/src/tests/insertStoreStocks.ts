import { getItem } from "../common-functions/getItem";
import { getStoreSupervisorByStoreId } from "../common-functions/getStoreSupervisorByStoreId";
import { AppDataSource } from "../data-source";
import { Item } from "../entity/Item";
import { Store } from "../entity/Store";
import { StoreStock } from "../entity/StoreStock";

export async function insertStoreStocks() {
  const item_ids = [3, 4, 9, 7];
  const items = [];
  const stores = [
    await AppDataSource.manager.findOne(Store, {
      where: { name: "Pitakotte Pagoda Road Store" },
      relations: { manager: true },
    }),
    await AppDataSource.manager.findOne(Store, {
      where: { name: "Ratnapura Ambiliwatta Road Store" },
      relations: { manager: true },
    }),
  ];

  console.log("From insertStoreStocks:", stores);

  // Get required items from the database
  for (const item_id of item_ids) {
    const item = AppDataSource.manager.create(Item, await getItem(item_id));
    items.push(item);
  }

  const stocks = [
    {
      store: stores[0],
      item: items[0],
      quantity: 20,
      unit_price: items[0].selling_price,
      supervisor: await getStoreSupervisorByStoreId(stores[0].store_id),
      manager: stores[0].manager,
    },
    {
      store: stores[1],
      item: items[1],
      quantity: 20,
      unit_price: items[1].selling_price,
      supervisor: await getStoreSupervisorByStoreId(stores[1].store_id),
      manager: stores[1].manager,
    },
    {
      store: stores[1],
      item: items[2],
      quantity: 30,
      unit_price: items[2].selling_price,
      supervisor: await getStoreSupervisorByStoreId(stores[1].store_id),
      manager: stores[1].manager,
    },
    {
      store: stores[0],
      item: items[3],
      quantity: 50,
      unit_price: items[3].selling_price,
      supervisor: await getStoreSupervisorByStoreId(stores[0].store_id),
      manager: stores[0].manager,
    },
  ];

  for (const stock of stocks) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(StoreStock, stock)
    );
  }
}
