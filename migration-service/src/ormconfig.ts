import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";


dotenv.config({ path: "../config.env" });

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "10"),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  synchronize: false,
  entities: [],
  // entities: [Migration],
  // migrations: [],
  migrations: ["./src/migrations/**/*.ts"],
});