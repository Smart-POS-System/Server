import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Region } from "../entity/Region";

export class RegionController {
  private regionRepository = AppDataSource.getRepository(Region);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.regionRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const region_id = parseInt(request.params.region_id);

    const region = await this.regionRepository.findOne({
      where: { region_id },
    });

    if (!region) {
      return "Unregistered region";
    }
    return region;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { name, manager_id } = request.body;

    const region = Object.assign(new Region(), {
      name,
      manager_id,
    });

    return this.regionRepository.save(region);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const region_id = parseInt(request.params.region_id);

    let regionToRemove = await this.regionRepository.findOneBy({ region_id });

    if (!regionToRemove) {
      return "This region does not exist";
    }

    await this.regionRepository.remove(regionToRemove);

    return "Region has been removed";
  }
}
