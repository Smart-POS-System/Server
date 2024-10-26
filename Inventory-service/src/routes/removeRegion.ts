import express from "express";
import { RegionController } from "../controllers/regionController";

const router = express.Router();

router.post("/removeRegion", RegionController.deleteRegion);

export { router as removeRegion };
