import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "process";

// Import TypeORM entities
import { Inventory } from "./entity/Inventory";
import { InventoryStock } from "./entity/InventoryStock";
import { InventorySupervisor } from "./entity/InventorySupervisor";
import { Item } from "./entity/Item";
import { Product } from "./entity/Product";
import { Region } from "./entity/Region";
import { Store } from "./entity/Store";
import { StoreCashier } from "./entity/StoreCashier";
import { StoreStock } from "./entity/StoreStock";
import { StoreSupervisor } from "./entity/StoreSupervisor";
import { Employee } from "./entity/Employee";
import { Role } from "./entity/Role";

const db_host = env.PG_HOST;
const db_port = parseInt(env.PG_PORT);
const db_name = env.PG_DB;
const db_user = env.PG_USER;
const db_password = env.PG_PASSWORD;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: db_host,
  port: db_port,
  username: db_user,
  password: db_password,
  database: db_name,
  synchronize: true,
  logging: false,
  entities: [
    Employee,
    Inventory,
    Role,
    InventoryStock,
    InventorySupervisor,
    Item,
    Product,
    Region,
    Store,
    StoreCashier,
    StoreStock,
    StoreSupervisor,
  ],
  migrations: [],
  subscribers: [],
});
