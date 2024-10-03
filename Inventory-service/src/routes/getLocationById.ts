import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.get("/location/:id", LocationController.getLocationById);

// router.get("/location", async (req: Request, res: Response) => {
//   const location_id = req.body;
//   const locationRepository = AppDataSource.getRepository(Location);
//   const location = await locationRepository.findOneBy({
//     location_id: location_id,
//   });
//   res.json(location).status(201);
// });

export { router as getLocationById };
