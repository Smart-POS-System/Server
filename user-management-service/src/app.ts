import express from "express";
import { userRouter } from "./Routes/employeeRoutes";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
// @ts-ignore
import { specs, swaggerUi } from "./swagger.ts";

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));

//connection swagger API-docs
//app.use("/api-docs/user-service", swaggerUi.serve, swaggerUi.setup(specs));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use("/api/v1/users", userRouter);

export default app;
