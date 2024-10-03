import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.get("/stores", LocationController.getStores);

export { router as getStores };
