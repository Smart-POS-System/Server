import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { StoreSupervisor } from "../entity/StoreSupervisor";

export class StoreSupervisorController {
  private storeSupervisorRepository =
    AppDataSource.getRepository(StoreSupervisor);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.storeSupervisorRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const supervisor_id = parseInt(request.params.supervisor_id);

    const supervisor = await this.storeSupervisorRepository.findOne({
      where: { supervisor_id },
    });

    if (!supervisor) {
      return "Unregistered supervisor";
    }
    return supervisor;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { store_id, employee_id } = request.body;

    const supervisor = Object.assign(new StoreSupervisor(), {
      store_id,
      employee_id,
    });

    return this.storeSupervisorRepository.save(supervisor);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const supervisor_id = parseInt(request.params.supervisor_id);

    let supervisorToRemove = await this.storeSupervisorRepository.findOneBy({
      supervisor_id,
    });

    if (!supervisorToRemove) {
      return "This supervisor does not exist";
    }

    await this.storeSupervisorRepository.remove(supervisorToRemove);

    return "Supervisor has been removed";
  }
}
