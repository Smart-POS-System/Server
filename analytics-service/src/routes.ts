import { SalesController } from "./controller/SalesController";

export const Routes = [
  {
    method: "get",
    route: "/daily-total-sales",
    controller: SalesController,
    middleware: [],
    action: "getTotalSalesData",
  },
  {
    method: "get",
    route: "/top-selling-products",
    controller: SalesController,
    middleware: [],
    action: "getTopSellingProducts",
  },
];
