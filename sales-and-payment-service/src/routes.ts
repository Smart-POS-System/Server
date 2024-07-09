import { BillController } from "./controller/BillController";
import { BillItemController } from "./controller/BillItemController";

export const Routes = [
  {
    method: "get",
    route: "/bills",
    controller: BillController,
    action: "all",
  },
  {
    method: "get",
    route: "/bills/:bill_id",
    controller: BillController,
    action: "one",
  },
  {
    method: "post",
    route: "/bills",
    controller: BillController,
    action: "save",
  },
  {
    method: "delete",
    route: "/bills/:bill_id",
    controller: BillController,
    action: "remove",
  },
  {
    method: "get",
    route: "/bill-items",
    controller: BillItemController,
    action: "all",
  },
  {
    method: "get",
    route: "/bill-items/:bill_id/:item_id",
    controller: BillItemController,
    action: "one",
  },
  {
    method: "post",
    route: "/bill-items",
    controller: BillItemController,
    action: "save",
  },
  {
    method: "delete",
    route: "/bill-items/:bill_id/:item_id",
    controller: BillItemController,
    action: "remove",
  },
];
