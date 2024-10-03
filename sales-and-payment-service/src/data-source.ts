import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "process";
import { Bill } from "./entities/Bill";
import { Customer } from "./entities/Customer";
import { Employee } from "./entities/Employee";
import { Location } from "./entities/Location";
import { Region } from "./entities/Region";
import { Product } from "./entities/Product";
import { Stock } from "./entities/Stock";
import { Item } from "./entities/Item";
import { Stock_Log } from "./entities/Stock_Log";

import dotenv from "dotenv";

dotenv.config();

const db_host = process.env.PG_HOST;
const db_port = parseInt(process.env.PG_PORT!, 10);
const db_name = process.env.PG_DB;
const db_user = process.env.PG_USER;
const db_password = process.env.PG_PASSWORD;

console.log(`Database Host: ${db_host}`);
console.log(`Database Port: ${db_port}`);
console.log(`Database Name: ${db_name}`);
console.log(`Database User: ${db_user}`);
console.log(`Database Password: ${db_password}`);

export const AppDataSource = new DataSource({
  type: "postgres",
  host: db_host,
  port: db_port,
  username: db_user,
  password: db_password,
  database: db_name,
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
//for local use
// export const AppDataSource = new DataSource({
//   type: "postgres",
//   host: "localhost",
//   port: 5430,
//   username: "postgres",
//   password: "postgres",
//   database: "postgres",
//   synchronize: false,
//   logging: true,
//   entities: [Customer, Employee, Location, Region, Product, Stock, Item, Bill],
//   migrations: [],
//   subscribers: [],
// });
