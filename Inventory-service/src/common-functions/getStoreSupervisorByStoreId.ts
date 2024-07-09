import { log } from "console";
import { AppDataSource } from "../data-source";
import { StoreSupervisor } from "../entity/StoreSupervisor";

export async function getStoreSupervisorByStoreId(store_id: number) {
  const supervisor = await AppDataSource.manager
    .createQueryBuilder(StoreSupervisor, "sv")
    .where("sv.store_id = :store_id", { store_id })
    .getOne();

  console.log("from getStoreSupervisorByStoreId: ", supervisor);

  return supervisor;
}
