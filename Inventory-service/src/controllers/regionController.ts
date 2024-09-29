// src/services/regionService.ts
import { Request, Response } from "express";
import { regionService } from "../services/regionService";

export class RegionController {
  static async getAllRegions(req: Request, res: Response) {
    try {
      const regions = await regionService.getRegions();

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
    const { locationId } = req.query;
    const location_id = parseInt(locationId as string, 10);
    try {
      const region = await regionService.getRegionById(location_id);

      if (!region) {
        return res.status(404).json({ msg: "No region found." });
      }
      return res.status(200).json(region);
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
      const newRegion = await regionService.addRegion(region_name, manager_id);
      return res.status(201).json(newRegion);
    } catch (error) {
      console.error("Error creating region:", error);
      return res.status(500).json({ msg: "Error creating region." });
    }
  }
}
