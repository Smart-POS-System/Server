import { SalesController } from "./controller/SalesController";

export const Routes = [
  // {
  //   method: "get",
  //   route: "/users",
  //   controller: UserController,
  //   middleware: [],
  //   action: "all",
  // },
  {
    method: "get",
    route: "/daily-total-sales",
    controller: SalesController,
    middleware: [],
    action: "getTotalSalesData",
  },
];
