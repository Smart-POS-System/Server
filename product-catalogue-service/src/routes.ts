import { ItemController } from "./controller/ItemController";
import { ProductController } from "./controller/ProductController";
import doesProductExist from "./middleware/doesProductExist";
import validateItem from "./middleware/validateItem";

export const Routes = [
  {
    method: "get",
    route: "/items",
    controller: ItemController,
    middleware: [],
    action: "all",
  },
  {
    method: "get",
    route: "/items/:item_id",
    controller: ItemController,
    middleware: [],
    action: "one",
  },
  {
    method: "post",
    route: "/items",
    controller: ItemController,
    middleware: [validateItem, doesProductExist],
    action: "save",
  },
  {
    method: "delete",
    route: "/items/:item_id",
    controller: ItemController,
    middleware: [],
    action: "remove",
  },
  {
    method: "get",
    route: "/products",
    controller: ProductController,
    middleware: [],
    action: "all",
  },
  {
    method: "get",
    route: "/products/:product_id",
    controller: ProductController,
    middleware: [],
    action: "one",
  },
  {
    method: "post",
    route: "/products",
    controller: ProductController,
    middleware: [],
    action: "save",
  },
  {
    method: "delete",
    route: "/products/:product_id",
    controller: ProductController,
    middleware: [],
    action: "remove",
  },
];
