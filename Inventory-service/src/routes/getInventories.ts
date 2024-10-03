import express from "express";
import { LocationController } from "../controllers/locationController";

const router = express.Router();

router.get("/inventories", LocationController.getInventories);

export { router as getInventories };
