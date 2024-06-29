import express from "express";
import { testRoute } from "./routes/test-route.js";

const app = express();
const port = 3001;

app.use(testRoute);
//redda
app.listen(port, () => {
  console.log(`product srv listening http://product-srv:${port}`);
});
