import express from "express";
import { RegionController } from "../controllers/regionController";

const router = express.Router();

router.post("/addRegion", RegionController.addRegion);

export { router as addRegion };
