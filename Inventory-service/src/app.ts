import express from "express";
import cors from "cors";
import { json } from "body-parser";

import { sample } from "./routes/sample";
import { addRegion } from "./routes/addRegion";
import { getRegions } from "./routes/getRegions";
import { getRegionById } from "./routes/getRegionById";
import { addLocation } from "./routes/addLocation";
import { getLocations } from "./routes/getLocations";
import { getLocationById } from "./routes/getLocationById";
import { addStock } from "./routes/addStock";
import { getStocks } from "./routes/getStocks";
import { getExpires } from "./routes/getExpires";
import { removeStock } from "./routes/removeStock";
import { sendStock } from "./routes/sendStock";
import { getStores } from "./routes/getStores";
import { getInventories } from "./routes/getInventories";

const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // Enable the Access-Control-Allow-Credentials header
};

app.use(cors(corsOptions));
// app.use(cors(corsOptions));
//app.set("trust proxy", true);
app.use(json());

//app.use(errorHandler); //custom middleware for error handeling
app.use(sample);
app.use(addRegion);
app.use(getRegions);
app.use(getRegionById);
app.use(addLocation);
app.use(getLocations);
app.use(getStores);
app.use(getInventories);
app.use(getLocationById);
app.use(addStock);
app.use(getStocks);
app.use(getExpires);
app.use(removeStock);
app.use(sendStock);

console.log("hi from app");

export { app };
