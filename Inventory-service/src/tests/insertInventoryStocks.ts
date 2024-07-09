import { getInventorySupervisorByInventoryId } from "../common-functions/getInventorySupervisorbySupervisorId";
import { getItem } from "../common-functions/getItem";
import { AppDataSource } from "../data-source";
import { Inventory } from "../entity/Inventory";
import { InventoryStock } from "../entity/InventoryStock";
import { Item } from "../entity/Item";

export async function insertInventoryStocks() {
  const item_ids = [3, 4, 9, 7];
  const items = [];
  const warehouses = [
    await AppDataSource.manager.findOne(Inventory, {
      where: { name: "Jubilee Post Warehouse" },
      relations: { manager: true },
    }),
    await AppDataSource.manager.findOne(Inventory, {
      where: { name: "New Town Road Warehouse" },
      relations: { manager: true },
    }),
  ];

  console.log("from insertInventoryStocks", warehouses);

  // Get required items from the database
  for (const item_id of item_ids) {
    const item = AppDataSource.manager.create(Item, await getItem(item_id));
    items.push(item);
  }

  const stocks = [
    {
      inventory: warehouses[0],
      item: items[0],
      quantity: 20,
      unit_price: items[0].selling_price,
      supervisor: await getInventorySupervisorByInventoryId(
        warehouses[0].inventory_id
      ),
      manager: warehouses[0].manager,
    },
    {
      inventory: warehouses[1],
      item: items[1],
      quantity: 20,
      unit_price: items[1].selling_price,
      supervisor: await getInventorySupervisorByInventoryId(
        warehouses[1].inventory_id
      ),
      manager: warehouses[1].manager,
    },
    {
      inventory: warehouses[1],
      item: items[2],
      quantity: 30,
      unit_price: items[2].selling_price,
      supervisor: await getInventorySupervisorByInventoryId(
        warehouses[1].inventory_id
      ),
      manager: warehouses[1].manager,
    },
    {
      inventory: warehouses[0],
      item: items[3],
      quantity: 50,
      unit_price: items[3].selling_price,
      supervisor: await getInventorySupervisorByInventoryId(
        warehouses[0].inventory_id
      ),
      manager: warehouses[0].manager,
    },
  ];

  for (const stock of stocks) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(InventoryStock, stock)
    );
  }
}
