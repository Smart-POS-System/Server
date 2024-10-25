// src/services/regionService.ts
import { Request, Response } from "express";
import { RegionService } from "../services/regionService";

export class RegionController {
  static async getAllRegions(req: Request, res: Response) {
    try {
      const regions = await RegionService.getRegions();

      if (!regions || regions.length === 0) {
        return res.status(404).json({ msg: "No regions found." });
      }
      return res.status(200).json(regions);
    } catch (error) {
      console.error("Error fetching regions:", error);
      return res.status(500).json({ msg: "Error fetching regions." });
    }
  }
  static async getRegionById(req: Request, res: Response) {
    const { location_id } = req.body;

    try {
      const region = await RegionService.getRegionById(location_id);
      if (region) {
        return res.status(200).json(region);
      }

      return res.status(404).json({ msg: "No region found." });
    } catch (error) {
      console.error("Error fetching regions:", error);
      return res.status(500).json({ msg: "Error fetching regions." });
    }
  }
  static async addRegion(req: Request, res: Response) {
    const { region_name, manager_id } = req.body;

    if (!region_name || !manager_id) {
      return res
        .status(400)
        .json({ msg: "Region name and manager ID are required." });
    }

    try {
      const newRegion = await RegionService.addRegion(region_name, manager_id);
      return res.status(201).json(newRegion);
    } catch (error) {
      console.error("Error creating region:", error);
      return res.status(500).json({ msg: "Error creating region." });
    }
  }

  static async deleteRegion(req: Request, res: Response) {
    const { region_id } = req.body;
    if (!region_id) {
      return res.status(400).json({ msg: "Region ID is required." });
    }
    try {
      await RegionService.deleteRegion(region_id);
      res.status(200).json({ msg: "Region deleted successfully." });
    } catch (error) {
      console.error("Error deleting region:", error);
      return res.status(500).json({ msg: "Error deleting region." });
    }
  }
}
