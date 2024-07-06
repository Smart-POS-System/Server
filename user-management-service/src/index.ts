import express, { Request, Response } from "express";
import { testRoute } from "./routes/test-route";

const app = express();
const port = 3002;

app.use(testRoute);

app.listen(port, () => {
  console.log(`prdct catalouge srv listening http://user-srv:${port}`);
});
