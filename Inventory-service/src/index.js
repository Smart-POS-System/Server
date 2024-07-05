import express, { json } from "express";
import { testRoute } from "./routes/test-route.js";

const app = express();
const port = 3003;

app.use(json());
app.use(testRoute);

app.listen(port, () => {
  console.log(`inventory srv listening http://inventory-srv:${port}`);
});
