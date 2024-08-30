import { app } from "./app";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    // create express app

    // setup express app here
    // ...

    // start express server
    app.listen(3000, () => {
      console.log(
        "Express server has started on port 3000. Open http://localhost:3000/products to see results"
      );
    });
  })
  .catch((error) => console.log(error));
