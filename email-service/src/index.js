import express, { json } from "express";
import { testRoute } from "./routes/test-route.js";
<<<<<<< Updated upstream
=======
import { specs, swaggerUi } from "./swagger.js";
import { sample } from "./routes/sample.js";
//test1
>>>>>>> Stashed changes

const app = express();
const port = 3000;

//connection swagger API-docs
app.use("/api-docs/email-service", swaggerUi.serve, swaggerUi.setup(specs));

//all the routes
app.use(testRoute);
app.use(sample);

app.listen(port, () => {
  console.log(`email srv listening http://email-srv:${port}`),
    console.log("API_Docs on- http://localhost:3000/api-docs/email-service/");
});
