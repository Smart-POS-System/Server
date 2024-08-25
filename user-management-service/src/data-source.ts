import "reflect-metadata";
import { DataSource } from "typeorm";
import { Customer } from "./entity/Customer";
import { Employee } from "./entity/Employee";
import dotenv from "dotenv";

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
  synchronize: true,
  logging: false,
  entities: [Employee, Customer],
  migrations: [],
  subscribers: [],
});
