import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import app from "./app";
import { Employee } from "./entities/Employee";
import { Customer } from "./entities/Customer";
import { Location } from "./entities/Location";
import { Region } from "./entities/Region";
import { Product } from "./entities/Product";
import { Stock } from "./entities/Stock";
import { Item } from "./entities/Item";
import { Bill } from "./entities/Bill";

// import { Employee } from "./entity/Employee";
// import { Customer } from "./entity/Customer";

// import { Roles } from "./enums/roles.enum";
//import { insertRoles } from "./tests/insertRoles";
//import { insertEmployees } from "./tests/insertEmployees";
import { specs, swaggerUi } from "./swagger";
import { Stock_Log } from "./entities/Stock_Log";

process.on("uncaughtException", (err: Error) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

//For local database
// export const AppDataSource = new DataSource({
//   type: process.env.DB_TYPE as any,
//   host: process.env.DB_HOST,
//   port: parseInt(process.env.DB_PORT || "", 10),
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   synchronize: true,
//   logging: false,
//   entities: [
//     Customer,
//     Employee,
//     Location,
//     Region,
//     Product,
//     Stock,
//     Item,
//     Bill,
//     Stock_Log,
//   ],
// });

//For remote database
export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.PG_HOST,
  port: parseInt(process.env.PG_PORT || "", 10),
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DB,
  synchronize: true,
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
});

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    console.log("user service is listening on http://localhost:49161");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });
app.use("/api-docs/users-service", swaggerUi.serve, swaggerUi.setup(specs));
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err: Error) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
