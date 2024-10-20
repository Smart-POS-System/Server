import { AppDataSource } from "../data-source";
import { Location } from "../entities/Location";
import { Types } from "../enums/units.enum";

export class LocationService {
  static async addLocation(
    name: string,
    type: Types,
    manager_id: number,
    region_id: number
  ) {
    const locationRepository = AppDataSource.getRepository(Location);

    // Validate input
    if (!name || !type || !manager_id || !region_id) {
      throw new Error("All fields are required.");
    }

    const location = {
      name: name,
      type: type,
      manager_id: manager_id,
      region_id: region_id,
    };
    try {
      const newLocation = await locationRepository.save(location);
      return newLocation;
    } catch (error) {
      console.error("Error adding location:", error);
      throw new Error("Error adding location.");
    }
  }
  static async getLocations() {
    const locationRepository = AppDataSource.getRepository(Location);
    try {
      const locations = await locationRepository.find();
      return locations;
    } catch (error) {
      console.log("Error fetching locations:", error);
      throw new Error("Error fetching locations.");
    }
  }
  static async getLocationById(location_id: number) {
    const locationRepository = AppDataSource.getRepository(Location);
    try {
      const location = await locationRepository.findOne({
        where: { location_id: location_id },
        select: {
          location_id: true,
          name: true,
          type: true,
          manager: {
            employee_id: true,
            name: true,
            email: true,
            role: true,
          },
          region: {
            region_id: true,
            name: true,
          },
        },
        relations: ["manager", "region"],
      });

      if (!location) {
        throw new Error("Location not found.");
      }

      return location;
    } catch (error) {
      console.error("Error fetching location:", error);
      throw new Error("Error fetching location.");
    }
  }
  static async getStores() {
    const locationRepository = AppDataSource.getRepository(Location);
    try {
      const locations = await locationRepository.find({
        where: { type: Types.STORE },
      });
      return locations;
    } catch (error) {
      console.log("Error fetching stores:", error);
      throw new Error("Error fetching stores.");
    }
  }
  static async getInventories() {
    const locationRepository = AppDataSource.getRepository(Location);
    try {
      const locations = await locationRepository.find({
        where: { type: Types.INVENTORY },
      });
      return locations;
    } catch (error) {
      console.log("Error fetching inventories:", error);
      throw new Error("Error fetching inventories.");
    }
  }
}
