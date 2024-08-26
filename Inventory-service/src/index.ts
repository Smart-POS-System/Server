import { AppDataSource } from "./data-source";
import { app } from "./app";
// import { specs, swaggerUi } from "./swagger";

const start = async () => {
  console.log("Starting up...!!");
  //checking for envs
  // if (!process.env.PG_DB) {
  //   throw new Error("PG_DB must be defined");
  // }
  //establishing db connection
  try {
    AppDataSource.initialize()
      .then(() => {
        console.log("Data Source has been initialized!");
      })
      .catch((err) => {
        console.error("Error during Data Source initialization:", err);
      });
  } catch (err) {
    console.error(err);
  }
  // app.use(
  //   "/api-docs/inventory-service",
  //   swaggerUi.serve,
  //   swaggerUi.setup(specs)
  // );
  const port = 3011;
  //startig server
  app.listen(port, () => {
    console.log(`email srv listening http://inventory-srv:${port}`),
      console.log(
        "API_Docs on- http://localhost:3000/api-docs/inventory-service/"
      );
  });
};

start();
