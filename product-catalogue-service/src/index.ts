import { app } from "./app";
import { AppDataSource } from "./data-source";

AppDataSource.initialize()
  .then(async () => {
    // create express app

    // setup express app here
    // ...

    // start express server
    app.listen(3000);

    console.log(
      "Express server has started on port 3000. Open http://localhost:3000/users to see results"
    );
    console.log("http://localhost:3000/api-docs/user-service");
  })
  .catch((error) => console.log(error));
