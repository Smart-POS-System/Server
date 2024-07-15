import express from "express";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import xss from "xss-clean";
import { userRouter } from "./Routes/employeeRoutes";
import { customerRouter } from "./Routes/customerRoutes";

const app = express();

app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(xss());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/customers", customerRouter);

export default app;
