import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entities/Customer";
import { Employee } from "./entities/Employee";
import { Bill } from "./entities/Bill";
import { Item } from "./entities/Item";
import { Location } from "./entities/Location";
import { Product } from "./entities/Product";
import { Region } from "./entities/Region";
import { Stock } from "./entities/Stock";
import dotenv from "dotenv";

/*const db_host = env.PG_HOST;
const db_port = parseInt(env.PG_PORT);
const db_name = env.PG_DB;
const db_user = env.PG_USER;
const db_password = env.PG_PASSWORD;*/

// const db_host = process.env.DB_HOST;
// const db_port = parseInt(process.env.DB_PORT || "", 10);
// const db_name = process.env.DB_NAME;
// const db_user = process.env.DB_USER;
// const db_password = process.env.DB_PASSWORD;

// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: db_host,
//   port: db_port,
//   username: db_user,
//   password: db_password,
//   database: db_name,
//   synchronize: true,
//   logging: true,
//   entities: [Customer, Employee],
//   migrations: [],
//   subscribers: [],
// });

dotenv.config({ path: "./config.env" });

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "", 10),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  synchronize: false,
  logging: true,
  entities: [Customer, Employee, Bill, Item, Location, Product, Region, Stock],
  // entities: [Customer, Employee],
});
