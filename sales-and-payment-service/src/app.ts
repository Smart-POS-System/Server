import express from "express";
import cors from "cors";
import { json } from "body-parser";
import { sample } from "./routes/sample";
import { newOrder } from "./routes/newOrder";
import { getOrder } from "./routes/getOrder";
import { getOrderbyId } from "./routes/getOrderById";
import { status } from "./routes/Status";

const app = express();
const corsOptions = {
  origin: "http://localhost:3000", // Your frontend URL
  credentials: true, // Enable the Access-Control-Allow-Credentials header
};

app.use(cors(corsOptions));
//app.set("trust proxy", true);
app.use(json());

//app.use(errorHandler); //custom middleware for error handeling
app.use(sample);
app.use(newOrder);
app.use(getOrder);
app.use(getOrderbyId);
app.use(status);
console.log("hi from app");

export { app };
