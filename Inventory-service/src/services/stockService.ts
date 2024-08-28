import { AppDataSource } from "../data-source";
import { Stock } from "../entities/Stock";

export class StockService {
  // adding a new stock to the database
  static async addNewStock(
    item_id: number,
    quantity: number,
    location_id: number,
    manager_id: number
  ) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const stock = {
      item_id: item_id,
      quantity: quantity,
      location_id: location_id,
      manager_id: manager_id,
    };
    await stockRepository.save(stock);
    console.log("adding stocks!!");
  }

  static async removeStock(stock_id: number) {
    const stockRepository = AppDataSource.getRepository(Stock);
    const stock = await stockRepository.findOneBy({ stock_id: stock_id });
    if (stock) {
      stock.quantity = 0;
      await stockRepository.save(stock);
    }
    console.log("removing stocks!!");
  }
}
