import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Stock } from "../entities/Stock";
import { Location } from "../entities/Location";

const router = express.Router();

router.get("/stocks", async (req: Request, res: Response) => {
  const location_id = 1;

  const locationRepository = AppDataSource.getRepository(Location);
  const stockRepository = AppDataSource.getRepository(Stock);

  const location = await locationRepository.findOneBy({
    location_id: location_id,
  });
  if (location) {
    const stocks = await stockRepository.findBy({ location: location });
    res.json(stocks).status(201);
  } else {
    // handle error of location not found
  }
});

export { router as getStocksByLocationId };
