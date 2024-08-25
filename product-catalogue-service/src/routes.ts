import { ItemController } from "./controller/ItemController";
import { ProductController } from "./controller/ProductController";
import doesItemExist from "./middleware/doesItemExist";
import doesItemForeignKeyConstraintExist from "./middleware/doesItemForeignKeyConstraintExist";
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
    middleware: [doesItemExist],
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
    middleware: [doesItemExist],
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
    middleware: [doesProductExist],
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
    middleware: [doesProductExist, doesItemForeignKeyConstraintExist],
    action: "remove",
  },
];
