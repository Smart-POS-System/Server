// import { AppDataSource } from "../data-source";
// import { NextFunction, Request, Response } from "express";
// import { Employee } from "../entity/Employee";

// export class EmployeeController {
//   private employeeRepository = AppDataSource.getRepository(Employee);

//   async all(request: Request, response: Response, next: NextFunction) {
//     return this.employeeRepository.find();
//   }

//   async one(request: Request, response: Response, next: NextFunction) {
//     const employee_id = parseInt(request.params.employee_id);

//     const employee = await this.employeeRepository.findOne({
//       where: { employee_id },
//     });

//     if (!employee) {
//       return "Unregistered employee";
//     }
//     return employee;
//   }

//   async save(request: Request, response: Response, next: NextFunction) {
//     const {
//       employee_name,
//       email,
//       role_id,
//       password_changed_at,
//       password_reset_token,
//       password_reset_expires,
//     } = request.body;

//     const employee = Object.assign(new Employee(), {
//       employee_name,
//       email,
//       role_id,
//       password_changed_at,
//       password_reset_token,
//       password_reset_expires,
//     });

//     return this.employeeRepository.save(employee);
//   }

//   async remove(request: Request, response: Response, next: NextFunction) {
//     const employee_id = parseInt(request.params.employee_id);

//     let employeeToRemove = await this.employeeRepository.findOneBy({
//       employee_id,
//     });

//     if (!employeeToRemove) {
//       return "This employee does not exist";
//     }

//     await this.employeeRepository.remove(employeeToRemove);

//     return "Employee has been removed";
//   }
// }
