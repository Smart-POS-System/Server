import { In, MoreThan, ILike, FindOperator } from "typeorm";
import { AppDataSource } from "../data-source";
import { Item } from "../entities/Item";
import { Stock } from "../entities/Stock";
import { Location } from "../entities/Location";
import { Stock_Log } from "../entities/Stock_Log";
import { Inventory_Transactions } from "../enums/inventoryTransactions.enum";
import { error } from "console";
import { Employee } from "../entities/Employee";
import { Product } from "../entities/Product";
import { Roles } from "../enums/roles.enum";

export class StockService {
  static getFlatArray(
    item_id: number,
    stockDetails: Stock,
    productDetails: Item
  ) {
    return {
      stock_id: stockDetails.stock_id,
      location_id: stockDetails.location.location_id,
      location: stockDetails.location.name,
      barcode: stockDetails.barcode,
      item_id: item_id,
      product_id: productDetails.product.product_id,
      batch_no: productDetails.batch_no,
      product_name: productDetails.product.product_name,
      quantity: stockDetails.quantity,
      unit_weight: productDetails.product.unit_weight,
      buying_price: productDetails.buying_price,
      selling_price: productDetails.selling_price,
      mfd: productDetails.mfd,
      exp: productDetails.exp,
    };
  }

  // get stocks given of all locations (Paginated)
  static async getStocks(
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const itemRepository = AppDataSource.getRepository(Item);

    const pageSize = page_size || 10;
    const currentPage = current_page || 1;

    // define the where conditions as required
    const whereConditions: {
      quantity: FindOperator<number>;
      barcode?: FindOperator<string>;
      item?: { product: { product_name: FindOperator<string> } };
    } = {
      quantity: MoreThan(0),
    };

    // Only add barcode condition if it's defined
    if (barcode) {
      whereConditions.barcode = ILike(`%${barcode}%`);
    }

    // Only add product name condition if it's defined
    if (product_name) {
      whereConditions.item = {
        product: { product_name: ILike(`%${product_name}%`) },
      };
    }

    const [stocks, total] = await stockRepository.findAndCount({
      relations: ["item", "location", "item.product"],
      where: whereConditions,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    // const [stocks, total] = await stockRepository.findAndCount({
    //   relations: ["item", "location"],
    //   where: {
    //     quantity: MoreThan(0),
    //     barcode: ILike(`%${barcode}%`),
    //     item: { product: { product_name: ILike(`%${product_name}%`) } },
    //   },
    //   skip: (currentPage - 1) * pageSize,
    //   take: pageSize,
    // });

    const flatArray = await Promise.all(
      stocks.map(async (stock) => {
        const item_id = stock.item.item_id;

        const productDetails = await itemRepository.find({
          relations: ["product"],
          where: { item_id: item_id },
        });

        if (productDetails.length > 0) {
          const product = productDetails[0];
          return this.getFlatArray(item_id, stock, product);
        }
        return null;
      })
    );

    return {
      stockCount: total,
      stocks: flatArray,
    };
  }

  // get stocks given of all locations
  static async getAllStocks(product_name: string, barcode: string) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const itemRepository = AppDataSource.getRepository(Item);

    // const [stocks, total] = await stockRepository.findAndCount({
    const stocks = await stockRepository.find({
      relations: ["item", "location", "item.product"],
      where: {
        quantity: MoreThan(0),
        barcode: ILike(`%${barcode}%`),
        item: { product: { product_name: ILike(`%${product_name}%`) } },
      },
    });

    const flatArray = await Promise.all(
      stocks.map(async (stock) => {
        const item_id = stock.item.item_id;

        const productDetails = await itemRepository.find({
          relations: ["product"],
          where: { item_id: item_id },
        });

        if (productDetails.length > 0) {
          const product = productDetails[0];
          return this.getFlatArray(item_id, stock, product);
        }
        return null;
      })
    );

    return {
      // stockCount: total,
      stocks: flatArray,
    };
  }

  // get stocks given a location (Paginated)
  static async getStocksByLocation(
    location_id: number,
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const itemRepository = AppDataSource.getRepository(Item);

    const pageSize = page_size || 10;
    const currentPage = current_page || 1;

    // define the where conditions as required
    const whereConditions: {
      location: { location_id: number };
      quantity: FindOperator<number>;
      barcode?: FindOperator<string>;
      item?: { product: { product_name: FindOperator<string> } };
    } = {
      location: { location_id: location_id },
      quantity: MoreThan(0),
    };

    // Only add barcode condition if it's defined
    if (barcode) {
      whereConditions.barcode = ILike(`%${barcode}%`);
    }

    // Only add product name condition if it's defined
    if (product_name) {
      whereConditions.item = {
        product: { product_name: ILike(`%${product_name}%`) },
      };
    }

    const [stocks, total] = await stockRepository.findAndCount({
      relations: ["item", "location", "item.product"],
      where: whereConditions,
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    const flatArray = await Promise.all(
      stocks.map(async (stock) => {
        const item_id = stock.item.item_id;

        const productDetails = await itemRepository.find({
          relations: ["product"],
          where: { item_id: item_id },
        });

        if (productDetails.length > 0) {
          const product = productDetails[0];
          return this.getFlatArray(item_id, stock, product);
        }
        return null;
      })
    );

    return {
      stockCount: total,
      stocks: flatArray,
    };
  }
  // get stocks given a location
  static async getAllStocksByLocation(
    location_id: number,
    product_name: string,
    barcode: string
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const itemRepository = AppDataSource.getRepository(Item);

    // define the where conditions as required
    const whereConditions: {
      location: { location_id: number };
      quantity: FindOperator<number>;
      barcode?: FindOperator<string>;
      item?: { product: { product_name: FindOperator<string> } };
    } = {
      location: { location_id: location_id },
      quantity: MoreThan(0),
    };

    // Only add barcode condition if it's defined
    if (barcode) {
      whereConditions.barcode = ILike(`%${barcode}%`);
    }

    // Only add product name condition if it's defined
    if (product_name) {
      whereConditions.item = {
        product: { product_name: ILike(`%${product_name}%`) },
      };
    }

    const stocks = await stockRepository.find({
      relations: ["item", "location", "item.product"],
      where: whereConditions,
    });

    // const [stocks, total] = await stockRepository.findAndCount({
    // const stocks = await stockRepository.find({
    //   relations: ["item", "location", "item.product"],
    //   where: {
    //     location: { location_id: location_id },
    //     quantity: MoreThan(0),
    //     barcode: ILike(`%${barcode}%`),
    //     item: { product: { product_name: ILike(`%${product_name}%`) } },
    //   },
    // });

    const flatArray = await Promise.all(
      stocks.map(async (stock) => {
        const item_id = stock.item.item_id;

        const productDetails = await itemRepository.find({
          relations: ["product"],
          where: { item_id: item_id },
        });

        if (productDetails.length > 0) {
          const product = productDetails[0];
          return this.getFlatArray(item_id, stock, product);
        }
        return null;
      })
    );

    return {
      // stockCount: total,
      stocks: flatArray,
    };
  }

  // get stocks given a region
  static async getStocksByRegion(
    region_id: number,
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const locationRepository = AppDataSource.getRepository(Location);
    const itemRepository = AppDataSource.getRepository(Item);

    const pageSize = page_size || 10;
    const currentPage = current_page || 1;

    const locations = await locationRepository.find({
      where: { region: { region_id: region_id } },
      select: { location_id: true },
    });

    const locationIds = locations.map((location) => location.location_id);

    const [stocks, total] = await stockRepository.findAndCount({
      relations: ["item", "location", "item.product"],
      where: {
        location: { location_id: In(locationIds) },
        quantity: MoreThan(0),
        barcode: ILike(`%${barcode}%`),
        item: { product: { product_name: ILike(`%${product_name}%`) } },
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
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

    return {
      stockCount: total,
      stocks: flatArray,
    };
  }

  // get stocks given a region
  static async getAllStocksByRegion(
    region_id: number,
    product_name: string,
    barcode: string
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const locationRepository = AppDataSource.getRepository(Location);
    const itemRepository = AppDataSource.getRepository(Item);

    const locations = await locationRepository.find({
      where: { region: { region_id: region_id } },
      select: { location_id: true },
    });

    const locationIds = locations.map((location) => location.location_id);

    // const [stocks, total] = await stockRepository.findAndCount({
    const stocks = await stockRepository.find({
      relations: ["item", "location", "item.product"],
      where: {
        location: { location_id: In(locationIds) },
        quantity: MoreThan(0),
        barcode: ILike(`%${barcode}%`),
        item: { product: { product_name: ILike(`%${product_name}%`) } },
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

    return {
      // stockCount: total,
      stocks: flatArray,
    };
  }

  // get all already expired stocks
  static async getExpired(
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stocks = (await this.getAllStocks(product_name, barcode)).stocks;

    console.log("Stocks: ", stocks);

    const today = new Date();
    if (stocks) {
      const expired = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) < today &&
          stock.quantity > 0
      );

      const paginatedExpired = expired.slice(
        (current_page - 1) * page_size,
        current_page * page_size
      );

      return {
        expiringCount: expired.length,
        stocks: paginatedExpired,
      };
    }
  }

  // get all stocks expiring soon
  static async getExpiring(
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stocks = (await this.getAllStocks(product_name, barcode)).stocks;

    const today = new Date();
    const expiringDate = new Date(today);
    expiringDate.setMonth(today.getMonth() + 3);
    if (stocks) {
      const expiring = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) >= today &&
          new Date(stock.exp) <= expiringDate &&
          stock.quantity > 0
      );

      const paginatedExpiring = expiring.slice(
        (current_page - 1) * page_size,
        current_page * page_size
      );

      // return expired;
      return {
        expiringCount: expiring.length,
        stocks: paginatedExpiring,
      };
    }
  }

  // get already expired stocks given a region
  static async getExpiredByRegion(
    region_id: number,
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stocks = (
      await this.getAllStocksByRegion(region_id, product_name, barcode)
    ).stocks;

    const today = new Date();
    if (stocks) {
      const expired = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) < today &&
          stock.quantity > 0
      );

      const paginatedExpired = expired.slice(
        (current_page - 1) * page_size,
        current_page * page_size
      );

      return {
        expiringCount: expired.length,
        stocks: paginatedExpired,
      };
    }
  }

  // get stocks expiring soon given a region
  static async getExpiringByRegion(
    region_id: number,
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stocks = (
      await this.getAllStocksByRegion(region_id, product_name, barcode)
    ).stocks;

    const today = new Date();
    const expiringDate = new Date(today);
    expiringDate.setMonth(today.getMonth() + 3);
    if (stocks) {
      const expiring = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) >= today &&
          new Date(stock.exp) <= expiringDate &&
          stock.quantity > 0
      );

      const paginatedExpiring = expiring.slice(
        (current_page - 1) * page_size,
        current_page * page_size
      );

      return {
        expiringCount: expiring.length,
        stocks: paginatedExpiring,
      };
    }
  }

  // get already expired stocks given a location
  static async getExpiredByLocation(
    location_id: number,
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    console.log(location_id);
    console.log(page_size);
    console.log(current_page);
    console.log(product_name);
    console.log(barcode);

    const stocks = (
      await this.getAllStocksByLocation(location_id, product_name, barcode)
    ).stocks;

    const today = new Date();
    if (stocks) {
      const expired = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) < today &&
          stock.quantity > 0
      );

      const paginatedExpired = expired.slice(
        (current_page - 1) * page_size,
        current_page * page_size
      );

      return {
        expiringCount: expired.length,
        stocks: paginatedExpired,
      };
    }
  }

  // get stocks expiring soon given a location
  static async getExpiringByLocation(
    location_id: number,
    page_size: number,
    current_page: number,
    product_name: string,
    barcode: string
  ) {
    const stocks = (
      await this.getAllStocksByLocation(location_id, product_name, barcode)
    ).stocks;

    const today = new Date();
    const expiringDate = new Date(today);
    expiringDate.setMonth(today.getMonth() + 3);
    if (stocks) {
      const expiring = stocks.filter(
        (stock) =>
          stock &&
          stock.exp &&
          new Date(stock.exp) >= today &&
          new Date(stock.exp) <= expiringDate &&
          stock.quantity > 0
      );

      const paginatedExpiring = expiring.slice(
        (current_page - 1) * page_size,
        current_page * page_size
      );

      return {
        expiringCount: expiring.length,
        stocks: paginatedExpiring,
      };
    }
  }

  // Adding a new stock to the database
  static async addStock(
    item_id: number,
    barcode: string,
    quantity: number,
    location_id: number,
    manager_id: number
  ) {
    const locationRepository = AppDataSource.getRepository(Location);
    const employeeRepository = AppDataSource.getRepository(Employee);
    const itemRepository = AppDataSource.getRepository(Item);
    const stockRepository = AppDataSource.getRepository(Stock);
    const stockLogRepository = AppDataSource.getRepository(Stock_Log);

    const location = await locationRepository.findOne({
      where: { location_id: location_id },
    });
    const manager = await employeeRepository.findOne({
      where: { employee_id: manager_id },
    });
    const item = await itemRepository.findOne({
      where: { item_id: item_id },
    });

    console.log(location?.location_id);
    console.log(manager?.employee_id);
    console.log(item);

    try {
      const savedStock = await AppDataSource.transaction(async () => {
        const stock = new Stock();
        if (location && manager && item) {
          stock.quantity = quantity;
          stock.barcode = barcode;
          stock.location = location;
          stock.employee = manager;
          stock.item = item;
        }

        const savedStock = await stockRepository.save(stock);
        // console.log(savedStock);

        const stockLog = new Stock_Log();
        stockLog.stock = savedStock;
        stockLog.quantity = quantity;
        stockLog.type = Inventory_Transactions.ADD;

        await stockLogRepository.save(stockLog);

        return savedStock;
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

        const prevQty = stock.quantity;
        stock.quantity = 0;

        const removedStock = await stockRepository.save(stock);
        console.log(removedStock);

        const stockLog = {
          stock: removedStock,
          quantity: prevQty,
          type: Inventory_Transactions.REMOVE,
        };
        const savedLog = await stockLogRepository.save(stockLog);
        console.log(savedLog);
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
      console.log("Previous: ", result);

      if (!result) {
        throw new Error("Stock not found");
      }

      if (result.quantity >= quantity) {
        // console.log(
        //   "Quantity float: ",
        //   parseFloat(quantity.toFixed(3)),
        //   "Quantity float: ",
        //   result.quantity
        // );

        result.quantity = parseFloat((result.quantity - quantity).toFixed(3));
        console.log("Quantity: ", result.quantity);

        const updatedStock = await stockRepository.save(result);
        console.log("Updated: ", updatedStock);
      } else {
        throw new Error("Not enough stocks available!");
      }

      return true;
    } catch (error) {
      console.error("Error in updateStock service: ", error);
      throw new Error("Database error while updating stock");
    }
  }

  // send a specified number of items from a stock from one location to another
  static async sendStock(
    stock_id: number,
    quantity: number,
    destination_id: number,
    manager_id: number // manager of requested store
  ) {
    // console.log("Quantity 1st: ", parseFloat(quantity.toFixed(3)));
    console.log("Quantity 1st: ", quantity);

    const stockRepository = AppDataSource.getRepository(Stock);
    const stock = await stockRepository.findOne({
      where: { stock_id: stock_id },
      relations: ["item"],
    });

    return await AppDataSource.manager.transaction(async () => {
      if (!stock) {
        throw new Error("Stock not found");
      } else {
        await this.updateStock(stock_id, quantity);
        await this.addStock(
          stock.item.item_id,
          stock.barcode,
          quantity,
          destination_id,
          manager_id
        );
      }
    });
  }
}
