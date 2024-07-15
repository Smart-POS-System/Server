import { UserRole } from "../enums/role.enum";

export const validRoles: string[] = [
  UserRole.GeneralManager,
  UserRole.RegionalManager,
  UserRole.InventoryManager,
  UserRole.InventorySupervisor,
  UserRole.StoreManager,
  UserRole.StoreSupervisor,
  UserRole.Cashier,
];
