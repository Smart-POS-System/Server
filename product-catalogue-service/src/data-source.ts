import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "process";
import { Item } from "./entity/Item";
import { Product } from "./entity/Product";

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
  entities: [Item, Product],
  migrations: [],
  subscribers: [],
});
