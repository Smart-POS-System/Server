import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { InventorySupervisor } from "../entity/InventorySupervisor";

export class InventorySupervisorController {
  private inventorySupervisorRepository =
    AppDataSource.getRepository(InventorySupervisor);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.inventorySupervisorRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const supervisor_id = parseInt(request.params.supervisor_id);

    const supervisor = await this.inventorySupervisorRepository.findOne({
      where: { supervisor_id },
    });

    if (!supervisor) {
      return "Unregistered supervisor";
    }
    return supervisor;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { inventory_id, employee_id } = request.body;

    const supervisor = Object.assign(new InventorySupervisor(), {
      inventory_id,
      employee_id,
    });

    return this.inventorySupervisorRepository.save(supervisor);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const supervisor_id = parseInt(request.params.supervisor_id);

    let supervisorToRemove = await this.inventorySupervisorRepository.findOneBy(
      {
        supervisor_id,
      }
    );

    if (!supervisorToRemove) {
      return "This supervisor does not exist";
    }

    await this.inventorySupervisorRepository.remove(supervisorToRemove);

    return "Supervisor has been removed";
  }
}
