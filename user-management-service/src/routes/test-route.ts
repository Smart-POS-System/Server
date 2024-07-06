import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.send("hello from tst route - users");
});

export { router as testRoute };
