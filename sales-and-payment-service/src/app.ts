import express from "express";

import { json } from "body-parser";
import { sample } from "./routes/sample";

const app = express();
app.set("trust proxy", true);
app.use(json());

//app.use(errorHandler); //custom middleware for error handeling
app.use(sample);
console.log("hi from app");

export { app };
