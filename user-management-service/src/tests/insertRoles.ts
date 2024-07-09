/*import { AppDataSource } from "../data-source";
import { Role } from "../entity/Role";

export async function insertRoles() {
  const roles = [
    { role_name: "store_cashier" },
    { role_name: "store_manager" },
    { role_name: "regional_manager" },
    { role_name: "inventory_manager" },
    { role_name: "general_manager" },
    { role_name: "store_supervisor" },
    { role_name: "inventory_supervisor" },
  ];

  for (const roleData of roles) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Role, roleData)
    );
  }
}
*/
