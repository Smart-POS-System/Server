import { CustomerController } from "./controller/CustomerController";
import { EmployeeController } from "./controller/EmployeeController";
import { RoleController } from "./controller/RoleController";

export const Routes = [
  {
    method: "get",
    route: "/customers",
    controller: CustomerController,
    action: "all",
  },
  {
    method: "get",
    route: "/customers/:param",
    controller: CustomerController,
    action: "one",
  },
  {
    method: "post",
    route: "/customers",
    controller: CustomerController,
    action: "save",
  },
  {
    method: "delete",
    route: "/customers/:nic",
    controller: CustomerController,
    action: "remove",
  },
  {
    method: "get",
    route: "/employees",
    controller: EmployeeController,
    action: "all",
  },
  {
    method: "get",
    route: "/employees/:employee_id",
    controller: EmployeeController,
    action: "one",
  },
  {
    method: "post",
    route: "/employees",
    controller: EmployeeController,
    action: "save",
  },
  {
    method: "delete",
    route: "/employees/:employee_id",
    controller: EmployeeController,
    action: "remove",
  },
  {
    method: "get",
    route: "/roles",
    controller: RoleController,
    action: "all",
  },
  {
    method: "get",
    route: "/roles/:role_id",
    controller: RoleController,
    action: "one",
  },
  {
    method: "post",
    route: "/roles",
    controller: RoleController,
    action: "save",
  },
  {
    method: "delete",
    route: "/roles/:role_id",
    controller: RoleController,
    action: "remove",
  },
];
