import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Role } from "../entity/Role";

export class RoleController {
  private roleRepository = AppDataSource.getRepository(Role);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.roleRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const role_id = parseInt(request.params.role_id);

    const role = await this.roleRepository.findOne({
      where: { role_id },
    });

    if (!role) {
      return "Unregistered role";
    }
    return role;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { role: role_name } = request.body;

    const role = Object.assign(new Role(), {
      role_name,
    });

    return this.roleRepository.save(role);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const role_id = parseInt(request.params.role_id);

    let roleToRemove = await this.roleRepository.findOneBy({
      role_id,
    });

    if (!roleToRemove) {
      return "This role does not exist";
    }

    await this.roleRepository.remove(roleToRemove);

    return "Role has been removed";
  }
}
