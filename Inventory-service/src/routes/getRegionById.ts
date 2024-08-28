import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Region } from "../entities/Region";

const router = express.Router();

router.get("/region", async (req: Request, res: Response) => {
  const region_id = 1;
  const regionRepository = AppDataSource.getRepository(Region);
  const region = await regionRepository.findOneBy({ region_id: region_id });
  res.json(region).status(201);
});

export { router as getRegionById };
