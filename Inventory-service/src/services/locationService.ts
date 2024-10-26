import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { Location } from "../entities/Location";
import { Roles } from "../enums/roles.enum";
import { Types } from "../enums/units.enum";
import { Region } from "../entities/Region";

export class LocationService {
  static async addLocation(
    name: string,
    type: string,
    manager_id: number,
    region_id: number
  ) {
    const locationRepository = AppDataSource.getRepository(Location);
    const regionRepository = AppDataSource.getRepository(Region);
    const employeeRepository = AppDataSource.getRepository(Employee);

    // Validate input
    if (!name || !type || !manager_id || !region_id) {
      throw new Error("All fields are required.");
    }

    try {
      const manager = await employeeRepository.findOneBy({
        employee_id: manager_id,
      });
      const region = await regionRepository.findOneBy({
        region_id: region_id,
      });

      if (!manager) {
        throw new Error("Manager not found.");
      } else if (!region) {
        throw new Error("Region not found.");
      }

      const location = new Location();
      location.name = name;
      location.manager = manager;
      location.region = region;
      if (type === "inventory") {
        location.type = Types.INVENTORY;
      } else if (type === "store") {
        location.type = Types.STORE;
      }

      return await locationRepository.save(location);
    } catch (error) {
      console.error("Error adding location:", error);
      throw new Error("Error adding location.");
    }
  }

  static async deleteLocation(location_id: number) {
    const locationRepository = AppDataSource.getRepository(Location);
    try {
      const location = await locationRepository.findOneBy({
        location_id: location_id,
      });
      if (!location) {
        throw new Error(`Location with ID ${location_id} not found.`);
      }

      await locationRepository.remove(location);
      console.log(location);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  static async getLocations() {
    const locationRepository = AppDataSource.getRepository(Location);
    const employeeRepository = AppDataSource.getRepository(Employee);
    try {
      const locations = await locationRepository.find({
        relations: ["manager", "region", "bills", "stocks"],
      });
      const storeManagers = await employeeRepository.find({
        where: {
          role: Roles.STORE_MANAGER,
        },
      });
      const inventoryManagers = await employeeRepository.find({
        where: {
          role: Roles.INVENTORY_MANAGER,
        },
      });

      return { locations, storeManagers, inventoryManagers };
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
