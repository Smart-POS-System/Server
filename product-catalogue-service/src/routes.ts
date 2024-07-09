import { ItemController } from "./controller/ItemController";
import { ProductController } from "./controller/ProductController";

export const Routes = [
  {
    method: "get",
    route: "/items",
    controller: ItemController,
    action: "all",
  },
  {
    method: "get",
    route: "/items/:item_id",
    controller: ItemController,
    action: "one",
  },
  {
    method: "post",
    route: "/items",
    controller: ItemController,
    action: "save",
  },
  {
    method: "delete",
    route: "/items/:item_id",
    controller: ItemController,
    action: "remove",
  },
  {
    method: "get",
    route: "/products",
    controller: ProductController,
    action: "all",
  },
  {
    method: "get",
    route: "/products/:product_id",
    controller: ProductController,
    action: "one",
  },
  {
    method: "post",
    route: "/products",
    controller: ProductController,
    action: "save",
  },
  {
    method: "delete",
    route: "/products/:product_id",
    controller: ProductController,
    action: "remove",
  },
];
