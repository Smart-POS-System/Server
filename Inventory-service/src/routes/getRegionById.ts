import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Region } from "../entities/Region";
import { RegionController } from "../controllers/regionController";

const router = express.Router();

router.post(
  "/region",
  RegionController.getRegionById
  //   async (req: Request, res: Response) => {
  //   const region_id = 1;
  //   const regionRepository = AppDataSource.getRepository(Region);
  //   const region = await regionRepository.findOneBy({ region_id: region_id });
  //   res.json(region).status(201);
  // }
);

export { router as getRegionById };
