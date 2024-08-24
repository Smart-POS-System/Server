import { AppDataSource } from "./data-source";
import { app } from "./app";
import { specs, swaggerUi } from "./swagger";

const start = async () => {
  console.log("Starting up...!!");
  //checking for envs
  if (!process.env.PG_DB) {
    throw new Error("PG_DB must be defined");
  }
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
  app.use("/api-docs/sales-service", swaggerUi.serve, swaggerUi.setup(specs));
  const port = 3011;
  //startig server
  app.listen(port, () => {
    console.log(`email srv listening http://sales-srv:${port}`),
      console.log("API_Docs on- http://localhost:3000/api-docs/sales-service/");
  });
};

<<<<<<< Updated upstream
    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](
        route.route,
        (req: Request, res: Response, next: Function) => {
          const result = new (route.controller as any)()[route.action](
            req,
            res,
            next
          );
          if (result instanceof Promise) {
            result.then((result) =>
              result !== null && result !== undefined
                ? res.send(result)
                : undefined
            );
          } else if (result !== null && result !== undefined) {
            res.json(result);
          }
        }
      );
    });

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    // insert new bills and bill-items for test
    // await insertBills();
    // console.log("Done with bills");

    // await insertBillItems();
    // console.log("Done with bill items");

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
=======
start();
>>>>>>> Stashed changes
