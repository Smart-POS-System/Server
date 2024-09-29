import { Request, Response } from "express";
import { LocationService } from "../services/locationService";

export class LocationController {
  static async addLocation(req: Request, res: Response) {
    const { location_name, region_id, type, manager_id } = req.body; // Extract parameters from the request body

    // Validate input
    if (!location_name || !region_id) {
      return res
        .status(400)
        .json({ msg: "Location name and region ID are required." });
    }

    try {
      const location = await LocationService.addLocation(
        location_name,
        type,
        manager_id,
        region_id
      );
      return res.status(201).json(location); // Return the created location with a 201 status
    } catch (error) {
      console.log("Error creating location:", error);
      return res.status(500).json({ msg: "Error creating location." });
    }
  }
  static async getLocations(req: Request, res: Response) {
    try {
      const locations = await LocationService.getLocations();
      return res.status(200).json(locations);
    } catch (error) {
      console.error("Error in getLocations:", error);
      return res.status(500).json({ message: "Error fetching locations." });
    }
  }
  static async getLocationById(req: Request, res: Response) {
    const location_id = parseInt(req.params.id);
    if (isNaN(location_id)) {
      return res.status(400).json({ message: "Invalid location ID." });
    }

    try {
      const location = await LocationService.getLocationById(location_id);
      return res.status(200).json(location);
    } catch (error) {
      console.log("Error in getLocationById:", error);
      if (error instanceof Error) {
        if (error.message === "Location not found.") {
          return res.status(404).json({ message: error.message });
        }
      }
      return res.status(500).json({ message: "Error fetching location." });
    }
  }
}
