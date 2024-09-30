import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.post("/addLocation", LocationController.addLocation);

export { router as addLocation };
