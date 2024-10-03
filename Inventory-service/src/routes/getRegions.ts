import express from "express";
import { RegionController } from "../controllers/regionController";

const router = express.Router();

router.get("/regions", RegionController.getAllRegions);

export { router as getRegions };
