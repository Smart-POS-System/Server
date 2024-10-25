import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.post("/removeLocation", LocationController.deleteLocation);

export { router as removeLocation };
