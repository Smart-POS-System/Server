import { AppDataSource } from "../data-source";
import { Region } from "../entities/Region";

export class regionService {
  static async getRegions() {
    const regionsRepository = AppDataSource.getRepository(Region);
    try {
      const regions = await regionsRepository.find({ relations: ["employee"] });
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
    try {
      const region = { name: region_name, manager_id: manager_id };
      return await regionRepository.save(region);
    } catch (error) {
      console.log("Error adding region. ", error);
      throw new Error("Error adding region.");
    }
  }
}
