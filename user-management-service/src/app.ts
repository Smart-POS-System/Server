import express from "express";
import { userRouter } from "./Routes/userRoutes";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/users", userRouter);

export default app;
