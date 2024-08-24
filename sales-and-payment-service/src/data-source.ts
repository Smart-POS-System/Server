import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "process";
import { Bill } from "./entity/Bill";
import { BillItem } from "./entity/BillItem";
import { Customer } from "./entity/Customer";
import { Employee } from "./entity/Employee";
import { Item } from "./entity/Item";
import { Product } from "./entity/Product";
import { Region } from "./entity/Region";
import { Store } from "./entity/Store";
import { Role } from "./entity/Role";
import { StoreCashier } from "./entity/StoreCashier";
import dotenv from "dotenv";

dotenv.config();

const db_host = process.env.PG_HOST;
const db_port = parseInt(process.env.PG_PORT!, 10);
const db_name = process.env.PG_DB;
const db_user = process.env.PG_USER;
const db_password = process.env.PG_PASSWORD;

// console.log(`Database Host: ${db_host}`);
// console.log(`Database Port: ${db_port}`);
// console.log(`Database Name: ${db_name}`);
// console.log(`Database User: ${db_user}`);
// console.log(`Database Password: ${db_password}`);

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
    Bill,
    BillItem,
    Customer,
    Employee,
    Item,
    Product,
    Region,
    Store,
    Role,
    StoreCashier,
  ],
  migrations: [],
  subscribers: [],
});
