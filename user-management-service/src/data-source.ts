import "reflect-metadata";
import { DataSource } from "typeorm";
import { Role } from "./entity/Role";
import { Customer } from "./entity/Customer";
import { Employee } from "./entity/Employee";

const db_host = process.env.DB_HOST;
const db_port = parseInt(process.env.DB_PORT || "", 10);
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_password = process.env.DB_PASSWORD;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: db_host,
  port: db_port,
  username: db_user,
  password: db_password,
  database: db_name,
  synchronize: true,
  logging: true,
  entities: [Customer, Employee],
  migrations: [],
  subscribers: [],
});
