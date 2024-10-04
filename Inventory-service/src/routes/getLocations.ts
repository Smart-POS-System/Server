import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.get("/locations", LocationController.getLocations);

export { router as getLocations };
