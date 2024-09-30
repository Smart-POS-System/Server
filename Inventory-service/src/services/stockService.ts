import { In } from "typeorm";
import { AppDataSource } from "../data-source";
import { Item } from "../entities/Item";
import { Stock } from "../entities/Stock";
import { Location } from "../entities/Location";
import { Stock_Log } from "../entities/Stock_Log";
import { Inventory_Transactions } from "../enums/inventoryTransactions.enum";
import { error } from "console";

export class StockService {
  static getFlatArray(
    item_id: number,
    stockDetails: Stock,
    productDetails: Item
  ) {
    return {
      stock_id: stockDetails.stock_id,
      item_id: item_id,
      quantity: stockDetails.quantity,
      selling_price: productDetails.selling_price,
      mfd: productDetails.mfd,
      exp: productDetails.exp,
      product_name: productDetails.product.product_name,
      unit_weight: productDetails.product.unit_weight,
    };
  }

  // get stocks given a location
  static async getStocksByLocation(location_id: number) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const itemRepository = AppDataSource.getRepository(Item);

    const stocks = await stockRepository.find({
      relations: ["item"],
      where: { location: { location_id: location_id } },
      select: {
        stock_id: true,
        quantity: true,
        item: {
          item_id: true,
        },
      },
    });

    const flatArray = await Promise.all(
      stocks.map(async (stock) => {
        const item_id = stock.item.item_id;

        const productDetails = await itemRepository.find({
          relations: ["product"],
          where: { item_id: item_id },
          select: {
            selling_price: true,
            mfd: true,
            exp: true,
            batch_no: true,
            product: {
              product_name: true,
              unit_weight: true,
            },
          },
        });

        if (productDetails.length > 0) {
          const product = productDetails[0];
          return this.getFlatArray(item_id, stock, product);
        }
        return null;
      })
    );

    return flatArray;
  }

  // get stocks given a region
  static async getStocksByRegion(region_id: number) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const locationRepository = AppDataSource.getRepository(Location);
    const itemRepository = AppDataSource.getRepository(Item);

    const locations = await locationRepository.find({
      where: { region: { region_id: region_id } },
      select: { location_id: true },
    });

    // if (locations) {
    const locationIds = locations.map((location) => location.location_id);
    console.log(locationIds);
    // }

    const stocks = await stockRepository.find({
      relations: ["item"],
      where: { location: { location_id: In(locationIds) } },
      select: {
        stock_id: true,
        quantity: true,
        item: {
          item_id: true,
        },
      },
    });

    const flatArray = await Promise.all(
      stocks.map(async (stock) => {
        const item_id = stock.item.item_id;

        const productDetails = await itemRepository.find({
          relations: ["product"],
          where: { item_id: item_id },
          select: {
            selling_price: true,
            mfd: true,
            exp: true,
            product: {
              product_name: true,
              unit_weight: true,
            },
          },
        });

        if (productDetails.length > 0) {
          const product = productDetails[0];
          return this.getFlatArray(item_id, stock, product);
        }
        return null;
      })
    );

    return flatArray;
  }
  // get already expired stocks given a location
  static async getExpired(location_id: number) {
    const stocks = await this.getStocksByLocation(location_id);

    const today = new Date();
    if (stocks) {
      const expired = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) < today &&
          stock.quantity > 0
      );
      return expired;
    }
  }

  // get stocks expiring soon given a location
  static async getExpiring(location_id: number) {
    const stocks = await this.getStocksByLocation(location_id);

    const today = new Date();
    const expiringDate = new Date(today);
    expiringDate.setMonth(today.getMonth() + 3);

    if (stocks) {
      const expiring = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) <= expiringDate &&
          new Date(stock.exp) > today &&
          stock.quantity > 0
      );
      return expiring;
    }
  }

  // adding a new stock to the database
  static async addStock(
    item_id: number,
    quantity: number,
    location_id: number,
    manager_id: number
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const stockLogRepository = AppDataSource.getRepository(Stock_Log);

    try {
      await AppDataSource.transaction(async () => {
        const stock = {
          item_id: item_id,
          quantity: quantity,
          location_id: location_id,
          manager_id: manager_id,
        };

        const savedStock = await stockRepository.save(stock);

        const stockLog = {
          stock_id: savedStock.stock_id,
          quantity: quantity,
          type: Inventory_Transactions.ADD,
        };

        const savedLog = await stockLogRepository.save(stockLog);
      });
    } catch (error) {
      console.error("Error adding stock:", error);
      throw new Error("Failed to add stock. Please try again later.");
    }
  }

  // remove a whole stock from inventory
  static async removeStock(stock_id: number) {
    try {
      await AppDataSource.transaction(async () => {
        const stockRepository = AppDataSource.getRepository(Stock);
        const stockLogRepository = AppDataSource.getRepository(Stock_Log);

        const stock = await stockRepository.findOneBy({ stock_id: stock_id });
        if (!stock) {
          console.error("Error removing stock: ", error);
          throw new Error("Stock not found.");
        }
        const removedStock = await stockRepository.delete(stock);

        const stockLog = {
          stock_id: stock.stock_id,
          quantity: stock.quantity,
          type: Inventory_Transactions.REMOVE,
        };
        const savedLog = await stockLogRepository.save(stockLog);
      });
    } catch (error) {
      console.error("Error removing stock: ", error);
      throw new Error("Database error while removing stock.");
    }
  }
  // Hereeeeeeeeeeeeee after
  // remove a specified number of items from a stock
  static async updateStock(stock_id: number, quantity: number) {
    const stockRepository = AppDataSource.getRepository(Stock);
    try {
      const result = await stockRepository.findOneBy({ stock_id: stock_id });

      if (!result) {
        throw new Error("Stock not found");
      }

      if (result.quantity >= quantity) {
        result.quantity -= quantity;
      } else {
        throw new Error("Not enough stocks available!");
      }

      return true;
    } catch (error) {
      console.error("Error in removeStock service: ", error);
      throw new Error("Database error while removing stock");
    }
  }

  // send a specified number of items from a stock from one location to another
  static async sendStock(
    stock_id: number,
    quantity: number,
    destination_id: number,
    manager_id: number // manager of requested store
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const stock = await stockRepository.findOneBy({ stock_id: stock_id });

    return await AppDataSource.manager.transaction(async () => {
      if (!stock) {
        throw new Error("Stock not found");
      }
      await this.updateStock(stock_id, quantity);
      await this.addStock(
        stock.item.item_id,
        quantity,
        destination_id,
        manager_id
      );
    });
  }
}
