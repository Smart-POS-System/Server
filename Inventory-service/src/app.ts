import express from "express";

import { json } from "body-parser";
import { sample } from "./routes/sample";
import { getRegions } from "./routes/getRegions";
import { getRegionById } from "./routes/getRegionById";
import { getLocationById } from "./routes/getLocationById";
import { getStocksByLocationId } from "./routes/getStocksByLocationId";

const app = express();
app.set("trust proxy", true);
app.use(json());

//app.use(errorHandler); //custom middleware for error handeling
app.use(sample);
app.use(getRegions);
app.use(getRegionById);
app.use(getLocationById);
app.use(getStocksByLocationId);
console.log("hi from app");

export { app };
