import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response } from "express";
import { AppDataSource } from "./data-source";
import { Routes } from "./routes";
import axios from "axios";
import { Region } from "./entity/Region";
import { Employee } from "./entity/Employee";
import { insertStores } from "./tests/insertStores";
import { insertRegions } from "./tests/insertRegions";
import { insertCashiers } from "./tests/insertCashiers";
import { insertStoreSupervisors } from "./tests/insertStoreSupervisors";
import { insertInventory } from "./tests/insertInventory";
import { insertInventorySupervisors } from "./tests/insertInventorySupervisors";
import { insertInventoryStocks } from "./tests/insertInventoryStocks";
import { insertStoreStocks } from "./tests/insertStoreStocks";

AppDataSource.initialize()
  .then(async () => {
    // create express app
    const app = express();
    app.use(bodyParser.json());

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

<<<<<<< Updated upstream
    // insert new regions for test
    // await insertRegions();

    // insert new stores for test
    // await insertStores();

    // insert cashiers for testing
    // await insertCashiers();

    // insert store supervisors for testing
    // await insertStoreSupervisors();

    // insert inventory for testing
    // await insertInventory();

    // insert inventory supervisors for testing
    // await insertInventorySupervisors();

    // insert inventory-warehouse and store stocks for testing
=======
    // // insert new regions for test
    // await insertRegions();

    // // insert new stores for test
    // await insertStores();

    // // insert cashiers for testing
    // await insertCashiers();

    // // insert store supervisors for testing
    // await insertStoreSupervisors();

    // // insert inventory for testing
    // await insertInventory();

    // // insert inventory supervisors for testing
    // await insertInventorySupervisors();

    // // insert inventory-warehouse and store stocks for testing
>>>>>>> Stashed changes
    // await insertInventoryStocks();
    // await insertStoreStocks();

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
  })
  .catch((error) => console.log(error));
