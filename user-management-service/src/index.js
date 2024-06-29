import express, { json } from "express";
import { testRoute } from "./routes/test-route.js";

const app = express();
const port = 3002;

app.use(json);
app.use(testRoute);

app.listen(port, () => {
  console.log(`product catalouge srv listening http://user-srv:${port}`);
});
