import { AppDataSource } from "../data-source";
import { Employee } from "../entities/Employee";
import { Region } from "../entities/Region";

export class RegionService {
  static async getRegions() {
    const regionsRepository = AppDataSource.getRepository(Region);
    try {
      const regions = await regionsRepository.find({
        relations: ["employee", "locations"],
      });

      return regions;
    } catch (error) {
      console.log("Error fetching regions:", error);
      throw new Error("Error fetching regions.");
    }
  }
  static async getRegionById(location_id: number) {
    const regionRepository = AppDataSource.getRepository(Region);
    try {
      const region = await regionRepository.findOneBy({
        locations: { location_id: location_id },
      });
      return region;
    } catch (error) {
      console.log("Error fetching region:", error);
      throw new Error("Error fetching region.");
    }
  }
  static async addRegion(region_name: string, manager_id: number) {
    const regionRepository = AppDataSource.getRepository(Region);
    const employeeRepository = AppDataSource.getRepository(Employee);
    try {
      const manager = await employeeRepository.findOneBy({
        employee_id: manager_id,
      });

      if (!manager) {
        throw new Error("Manager not found.");
      }

      // Create a new region instance
      const region = new Region();
      region.name = region_name;
      region.employee = manager; // Set the employee relation

      // console.log(region);
      return await regionRepository.save(region);
    } catch (error) {
      console.log("Error adding region. ", error);
      throw new Error("Error adding region.");
    }
  }
  static async deleteRegion(region_id: number) {
    const regionsRepository = AppDataSource.getRepository(Region);
    try {
      const region = await regionsRepository.findOneBy({
        region_id: region_id,
      });
      if (!region) {
        throw new Error(`Region with ID ${region_id} not found.`);
      }

      await regionsRepository.remove(region);
      console.log(region);
      return;
    } catch (error) {
      console.log(error);
    }
  }
}
