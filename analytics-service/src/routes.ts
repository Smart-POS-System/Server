import { SalesController } from "./controller/SalesController";
import { TransactionController } from "./controller/TransactionController";

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
  {
    method: "get",
    route: "/sales-transactions",
    controller: TransactionController,
    middleware: [],
    action: "getBillData",
  },
];
