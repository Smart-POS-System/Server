import { AppDataSource } from "../data-source";
import { Item } from "../entity/Item";
import { Product } from "../entity/Product";

export async function insertItems() {
  const items = [
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Bag of Potatoes",
      }),
      batch_code: "8106",
      buying_price: 500,
      selling_price: 600,
      mfd: new Date(2024, 4, 10),
      exp: new Date(2024, 8, 10),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Bag of Potatoes",
      }),
      batch_code: "12XF",
      buying_price: 500,
      selling_price: 600,
      mfd: new Date(2024, 5, 19),
      exp: new Date(2024, 9, 19),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Salmon Fillet",
      }),
      batch_code: "AB41",
      buying_price: 700,
      selling_price: 720,
      mfd: new Date(2024, 3, 10),
      exp: new Date(2024, 4, 10),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Whole Milk - 1L carton",
      }),
      batch_code: "8106",
      buying_price: 350,
      selling_price: 380,
      mfd: new Date(2024, 4, 10),
      exp: new Date(2024, 4, 16),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Cheddar Cheese Block",
      }),
      batch_code: "8106",
      buying_price: 700,
      selling_price: 800,
      mfd: new Date(2024, 4, 3),
      exp: new Date(2024, 10, 3),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Carton of Strawberries",
      }),
      batch_code: "334D",
      buying_price: 1000,
      selling_price: 1200,
      mfd: new Date(2024, 4, 25),
      exp: new Date(2024, 5, 17),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Banana Bunch",
      }),
      batch_code: "8K95",
      buying_price: 180,
      selling_price: 200,
      mfd: new Date(2024, 4, 10),
      exp: new Date(2024, 4, 24),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Carton of Strawberries",
      }),
      batch_code: "0B02",
      buying_price: 1000,
      selling_price: 1200,
      mfd: new Date(2024, 3, 20),
      exp: new Date(2024, 4, 20),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Cheddar Cheese Block",
      }),
      batch_code: "8106",
      buying_price: 700,
      selling_price: 800,
      mfd: new Date(2024, 2, 7),
      exp: new Date(2024, 8, 7),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Whole Milk - 1L carton",
      }),
      batch_code: "8106",
      buying_price: 350,
      selling_price: 380,
      mfd: new Date(2024, 7, 4),
      exp: new Date(2024, 7, 10),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Banana Bunch",
      }),
      batch_code: "0275",
      buying_price: 180,
      selling_price: 200,
      mfd: new Date(2024, 7, 1),
      exp: new Date(2024, 7, 10),
    },
    {
      product: await AppDataSource.manager.findOneBy(Product, {
        product_name: "Salmon Fillet",
      }),
      batch_code: "1L01",
      buying_price: 700,
      selling_price: 720,
      mfd: new Date(2024, 7, 6),
      exp: new Date(2024, 8, 10),
    },
  ];

  for (const item of items) {
    await AppDataSource.manager.save(AppDataSource.manager.create(Item, item));
  }
}
