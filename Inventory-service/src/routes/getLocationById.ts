import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.get("/location", LocationController.getLocationById);

export { router as getLocationById };
