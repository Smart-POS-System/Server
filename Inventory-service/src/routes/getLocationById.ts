import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Location } from "../entities/Location";

const router = express.Router();

router.get("/location", async (req: Request, res: Response) => {
  const location_id = 1;
  const locationRepository = AppDataSource.getRepository(Location);
  const location = await locationRepository.findOneBy({
    location_id: location_id,
  });
  res.json(location).status(201);
});

export { router as getLocationById };
