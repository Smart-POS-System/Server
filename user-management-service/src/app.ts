import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import cors from "cors";
import { userRouter } from "./Routes/employeeRoutes";
import { customerRouter } from "./Routes/customerRoutes";

const app = express();

const corsOptions = {
  origin: "http://localhost:3001", // Your frontend URL
  credentials: true, // Enable the Access-Control-Allow-Credentials header
};

app.use(cors(corsOptions));

// @ts-ignore
import { specs, swaggerUi } from "./swagger.ts";

app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

//connection swagger API-docs
//app.use("/api-docs/user-service", swaggerUi.serve, swaggerUi.setup(specs));

const limiter = rateLimit({
  max: 200,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);

export default app;
