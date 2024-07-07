import express from "express";
import { userRouter } from "./Routes/userRoutes";
import cookieParser from "cookie-parser";

const app = express();

app.use(cookieParser());

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);

export default app;
