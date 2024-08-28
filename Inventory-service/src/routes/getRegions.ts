import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { getRepository } from "typeorm";
import { Region } from "../entities/Region";

const router = express.Router();

router.get("/regions", async (req: Request, res: Response) => {
  try {
    const regionRepository = AppDataSource.getRepository(Region);
    const regions = await regionRepository.find();
    res.json(regions).status(201);
  } catch (err) {
    res.send(err).status(400).json({ msg: "Database connection Error!" });
  }
});

export { router as getRegions };
