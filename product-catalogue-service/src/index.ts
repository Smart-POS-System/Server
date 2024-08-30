import { app } from "./app";
import { AppDataSource } from "./data-source";
import swaggerUi from "swagger-ui-express";
//import specs from './swaggerSpecs'; // or however you have defined it

AppDataSource.initialize()
  .then(async () => {
    // create express app

    // setup express app here
    // ...

    // start express server

    //connection swagger API-docs
    //app.use("/api-docs/user-service", swaggerUi.serve, swaggerUi.setup(specs));

    //console.log("http://localhost:3000/api-docs/user-service");

    app.listen(3000, () => {
      console.log(
        "Express server has started on port 3000. Open http://localhost:3000/products to see results"
      );
    });
  })
  .catch((error) => console.log(error));
