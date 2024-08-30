const express = require("express");
const cors = require("cors");
const multer = require("multer");
import * as bodyParser from "body-parser";
import { Routes } from "./routes";
import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";

const app = express();
const upload = multer();

app.use(
  cors({
    origin: "http://localhost:3000", // Only allow requests from this origin
    methods: ["GET", "POST"], // Allow specific HTTP methods
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(upload.none());
app.use(bodyParser.json());

// register express routes from defined application routes
Routes.forEach((route) => {
  const middleware = route.middleware;

  (app as any)[route.method](
    route.route,
    ...middleware,
    (req: Request, res: Response, next: NextFunction) => {
      const result = new (route.controller as any)()[route.action](
        req,
        res,
        next
      );
      if (result instanceof Promise) {
        result.then((result) =>
          result !== null && result !== undefined ? res.send(result) : undefined
        );
      } else if (result !== null && result !== undefined) {
        res.json(result);
      }
    }
  );
});

export { app };
