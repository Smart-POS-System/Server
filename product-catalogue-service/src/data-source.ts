import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "process";
import { Product } from "./entities/Product";
import { Item } from "./entities/Item";
import { Customer } from "./entities/Customer";
import { Employee } from "./entities/Employee";
import { Location } from "./entities/Location";
import { Region } from "./entities/Region";
import { Stock } from "./entities/Stock";
import { Bill } from "./entities/Bill";

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
  synchronize: false,
  logging: true,
  entities: [Customer, Employee, Location, Region, Product, Stock, Item, Bill],
  migrations: [],
  subscribers: [],
});
