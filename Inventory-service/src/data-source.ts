import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "process";

// Import TypeORM entities
import { Region } from "./entities/Region";
import { Location } from "./entities/Location";
import { Stock } from "./entities/Stock";
import { Customer } from "./entities/Customer";
import { Employee } from "./entities/Employee";
import { Product } from "./entities/Product";
import { Item } from "./entities/Item";
import { Bill } from "./entities/Bill";
import { Stock_Log } from "./entities/Stock_Log";

const db_host = env.PG_HOST || "localhost"; // Provide a default value
const db_port = parseInt(env.PG_PORT!) || 5432; // Use the non-null assertion and a default value
const db_name = env.PG_DB || "mydatabase"; // Provide a default value
const db_user = env.PG_USER || "user"; // Provide a default value
const db_password = env.PG_PASSWORD || "password"; // Provide a default value

// Remote database config
// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: db_host,
//   port: db_port,
//   username: db_user,
//   password: db_password,
//   database: db_name,
//   synchronize: false,
//   logging: true,
//   entities: [Customer, Employee, Location, Region, Product, Stock, Item, Bill, Stock_Log],
//   migrations: [],
//   subscribers: [],
// });

// Local database config
export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5400,
  username: "postgres",
  password: "postgres",
  database: "postgres",
  synchronize: false,
  logging: true,
  entities: [
    Customer,
    Employee,
    Location,
    Region,
    Product,
    Stock,
    Item,
    Bill,
    Stock_Log,
  ],
  migrations: [],
  subscribers: [],
});
