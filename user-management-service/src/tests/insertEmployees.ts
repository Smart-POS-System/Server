/*import { AppDataSource } from "../data-source";
import { Employee } from "../entity/Employee";
import { Role } from "../entity/Role";

export async function insertEmployees() {
  const employees = [
    {
      employee_name: "John Doe",
      email: "john.doe@example.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "regional_manager",
      }),
    },
    {
      employee_name: "Grown Adult",
      email: "grownman@earth.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "regional_manager",
      }),
    },
    {
      employee_name: "Greg Smith",
      email: "greg.smith@example.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "store_cashier",
      }),
    },
    {
      employee_name: "Lindsey Scott",
      email: "lindsey.scott@example.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "store_manager",
      }),
    },
    {
      employee_name: "Valorant Agent",
      email: "valorant@example.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "general_manager",
      }),
    },
    {
      employee_name: "Big Boy",
      email: "bigboy@docker.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "store_supervisor",
      }),
    },
    {
      employee_name: "Glen Parker",
      email: "glen@park.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "store_manager",
      }),
    },
    {
      employee_name: "Chris Scott",
      email: "chrisbrown@hollywood.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "store_cashier",
      }),
    },
    {
      employee_name: "Mark Zuckerberg",
      email: "mz@facebook.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "inventory_supervisor",
      }),
    },
    {
      employee_name: "John Keells",
      email: "keells@jk.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "inventory_manager",
      }),
    },
    {
      employee_name: "Born Peels",
      email: "bornpeels@colombo.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "inventory_manager",
      }),
    },
    {
      employee_name: "Baby Driver",
      email: "adam@hollywood.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "inventory_supervisor",
      }),
    },
    {
      employee_name: "Elon Musk",
      email: "elonmusk@x.com",
      role: await AppDataSource.manager.findOneBy(Role, {
        role_name: "store_supervisor",
      }),
    },
  ];

  for (const employeeData of employees) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Employee, employeeData)
    );
  }
}*/
