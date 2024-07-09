import { AppDataSource } from "../data-source";
import { Product } from "../entity/Product";

export async function insertProducts() {
  const products = [
    { product_name: "Bag of Potatoes", unit_weight: "2kg" },
    { product_name: "Salmon Fillet", unit_weight: "0.6kg" },
    { product_name: "Whole Milk - 1L carton", unit_weight: "1kg" },
    { product_name: "Cheddar Cheese Block", unit_weight: "0.3kg" },
    { product_name: "Carton of Strawberries", unit_weight: "0.4kg" },
    { product_name: "Banana Bunch", unit_weight: "1kg" },
  ];

  for (const product of products) {
    await AppDataSource.manager.save(
      AppDataSource.manager.create(Product, product)
    );
  }
}
