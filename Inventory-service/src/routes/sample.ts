import express, { Request, Response } from "express";

const router = express.Router();

router.get("/sample", (req: Request, res: Response) => {
  res.json({ message: "This is a sample message" });
});

export { router as sample };
