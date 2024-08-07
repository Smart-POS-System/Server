import express, { json } from "express";
import { testRoute } from "./routes/test-route.js";

const app = express();
const port = 3000;

app.use(json());
app.use(testRoute);

app.listen(port, () => {
  console.log(`email srv listening http://email-srv:${port}`);
});
