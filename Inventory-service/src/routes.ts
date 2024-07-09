import { InventoryController } from "./controller/InventoryController";
import { InventoryStockController } from "./controller/InventoryStockController";
import { InventorySupervisorController } from "./controller/InventorySupervisorController";
import { RegionController } from "./controller/RegionController";
import { StoreCashierController } from "./controller/StoreCashierController";
import { StoreController } from "./controller/StoreController";
import { StoreStockController } from "./controller/StoreStockController";
import { StoreSupervisorController } from "./controller/StoreSupervisorController";

export const Routes = [
  {
    method: "get",
    route: "/inventory",
    controller: InventoryController,
    action: "all",
  },
  {
    method: "get",
    route: "/inventory/:inventory_id",
    controller: InventoryController,
    action: "one",
  },
  {
    method: "post",
    route: "/inventory",
    controller: InventoryController,
    action: "save",
  },
  {
    method: "delete",
    route: "/inventory/:inventory_id",
    controller: InventoryController,
    action: "remove",
  },
  {
    method: "get",
    route: "/inventory-stock",
    controller: InventoryStockController,
    action: "all",
  },
  {
    method: "get",
    route: "/inventory-stock/:stock_id",
    controller: InventoryStockController,
    action: "one",
  },
  {
    method: "post",
    route: "/inventory-stock",
    controller: InventoryStockController,
    action: "save",
  },
  {
    method: "delete",
    route: "/inventory-stock/:stock_id",
    controller: InventoryStockController,
    action: "remove",
  },
  {
    method: "get",
    route: "/inventory-supervisors",
    controller: InventorySupervisorController,
    action: "all",
  },
  {
    method: "get",
    route: "/inventory-supervisors/:supervisor_id",
    controller: InventorySupervisorController,
    action: "one",
  },
  {
    method: "post",
    route: "/inventory-supervisors",
    controller: InventorySupervisorController,
    action: "save",
  },
  {
    method: "delete",
    route: "/inventory-supervisors/:supervisor_id",
    controller: InventorySupervisorController,
    action: "remove",
  },
  {
    method: "get",
    route: "/regions",
    controller: RegionController,
    action: "all",
  },
  {
    method: "get",
    route: "/regions/:region_id",
    controller: RegionController,
    action: "one",
  },
  {
    method: "post",
    route: "/regions",
    controller: RegionController,
    action: "save",
  },
  {
    method: "delete",
    route: "/regions/:region_id",
    controller: RegionController,
    action: "remove",
  },
  {
    method: "get",
    route: "/stores",
    controller: StoreController,
    action: "all",
  },
  {
    method: "get",
    route: "/stores/:store_id",
    controller: StoreController,
    action: "one",
  },
  {
    method: "post",
    route: "/stores",
    controller: StoreController,
    action: "save",
  },
  {
    method: "delete",
    route: "/stores/:store_id",
    controller: StoreController,
    action: "remove",
  },
  {
    method: "get",
    route: "/store-cashiers",
    controller: StoreCashierController,
    action: "all",
  },
  {
    method: "get",
    route: "/store-cashiers/:cashier_id",
    controller: StoreCashierController,
    action: "one",
  },
  {
    method: "post",
    route: "/store-cashiers",
    controller: StoreCashierController,
    action: "save",
  },
  {
    method: "delete",
    route: "/store-cashiers/:cashier_id",
    controller: StoreCashierController,
    action: "remove",
  },
  {
    method: "get",
    route: "/store-stock",
    controller: StoreStockController,
    action: "all",
  },
  {
    method: "get",
    route: "/store-stock/:stock_id",
    controller: StoreStockController,
    action: "one",
  },
  {
    method: "post",
    route: "/store-stock",
    controller: StoreStockController,
    action: "save",
  },
  {
    method: "delete",
    route: "/store-stock/:stock_id",
    controller: StoreStockController,
    action: "remove",
  },
  {
    method: "get",
    route: "/store-supervisors",
    controller: StoreSupervisorController,
    action: "all",
  },
  {
    method: "get",
    route: "/store-supervisors/:supervisor_id",
    controller: StoreSupervisorController,
    action: "one",
  },
  {
    method: "post",
    route: "/store-supervisors",
    controller: StoreSupervisorController,
    action: "save",
  },
  {
    method: "delete",
    route: "/store-supervisors/:supervisor_id",
    controller: StoreSupervisorController,
    action: "remove",
  },
];
