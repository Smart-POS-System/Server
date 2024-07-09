import { AppDataSource } from "../data-source";
import { InventorySupervisor } from "../entity/InventorySupervisor";

export async function getInventorySupervisorByInventoryId(
  inventory_id: number
) {
  console.log("inventory id to look for:", inventory_id);
  const supervisor = await AppDataSource.manager
    .createQueryBuilder(InventorySupervisor, "is")
    .where("is.inventory_id = :inventory_id", { inventory_id })
    .getOne();

  console.log("From getInventorySupervisorByInventoryId");
  console.log(supervisor);

  return supervisor;
}
